import { Collector } from '../helpers/utils';

const uuid = require('uuid');
const extend = require('util')._extend;

export default class Collection {
	/**
	 * @param name: unique name for collection
	 * @param schema: schema definition for validation in colleciton
	 * @param indexByProp: unique index for each collection entry. this is going to be required.
	 * @throws Error if invalid schema
	 * @throws Error if unexpected error initializing page with unique id
	 * @throws Error if invalid indexByProp
	 */
	constructor(name, schema, indexByProp) {
		this.$name = name;

		if (!indexByProp || !indexByProp.length)
			throw new Error(`Invalid indexByProp: ${indexByProp}. It should be a valid string naming the field that every entry is unique by.`);
		this.indexingProp = indexByProp;
		this._setSchema(schema);
		this.entries = new Map();
		
		this._id = uuid();
		
		let insertionAttempt = Collector.addCollection(this);
		if (!insertionAttempt) throw new Error(`Unexpected error initializing ${this.constructor.name} class with name ${name}. Ensure a collection with the same name has not already been created.`);
	}

	get id() {
		return this._id;
	}

	get name() {
		return this.$name;
	}

	/**
	 * find an entry
	 * @param matchObj: object - with one property (key), and associated value to retrieve entry by
	 * @return matching entry or undefined
	 */
	findOne(matchObj) {
		const key = Object.keys(matchObj)[0];
		return this._get(key, matchObj[key]);
	}

	/**
	 * find all entries
	 * @param matchObj: object - with one property (key), and associated value to retrieve entry by
	 * @return array of matching entries or undefined
	 */
	find(matchObj) {
		const key = Object.keys(matchObj)[0];
		return this._get(key, matchObj[key], true);
	}

	/**
	 * @return iterable of all entries stored in collection
	 */
	findAll() {
		return Array.from(this.entries.values());
	}

	/**
	 * insert entry to collection
	 * @param o: item to insert into collection
	 * @throws Error if item does not validate against collection's schema
	 * @return previous entry with the same value for its 'indexingProp' if exists
	 */
	insert(o) {
		if (!Collection.validateAgainstSchema(o, this))
			throw new Error(`Invalid insertion item. ${o}`);
		const key = o[this.indexingProp];
		return this.entries.set(key, this._fillDefaultValues(o));
	}

	/**
	 * remove entry from collection
	 * NOTE: removal would be quicker if key is the unique indexing property
	 * @param key: key to match value with
	 * @param value: value to match against
	 * @return deleted entry or undefined
	 */
	remove(key, value) {
		if (typeof key != "string")
			throw new Error(`Invalid key: ${key}. This param must be a string of the property to match value with`);
		
		if (key === this.indexingProp) {
			return this.entries.delete(value);
		} else {
			const entries = this.entries.entries();
			for (let entry of entries) {
				if (entry[0] == key && entry[1] == value)
					return this.entries.delete(entry[this.indexingProp]);
			}
		};
		return;
	}

	/*
	 * update schema
	 * @param schema: object -- schema
	 * @throws Error if invalid schema
	 * @return old schema
	 */
	_setSchema(schema) {
		if(!Collection.validateSchema(schema, [this.indexingProp])) throw new Error(`Invalid schema: ${schema}`);

		const old = this.schema;
		this.schema = schema;

		let propBreakdown = Object.keys(schema).reduce((accum, prop) => {
			if (typeof schema[prop].defaultValue != "undefined") {
				accum[0][prop] = true;
			} else if (schema[prop].required) {
				accum[1][prop] = true;
			}
			return accum;
		}, [{}, {}]);
		this.propsWithDefaults = propBreakdown[0];
		this.requiredWithNoDefault = propBreakdown[1];

		return old;
	}

	/**
	 * looks through an entry's properties and fills missing properties with schema-defined default values
	 * @param entry: object -- an entry object validated against schema already
	 * @return entry object with missing properties filled in using schema-defined defaults
	 */
	_fillDefaultValues(entry) {
		let defaultDefinedProps = extend({}, this.propsWithDefaults);
		for (let prop in entry) {
			if (typeof entry[prop] != "undefined" && prop in defaultDefinedProps)
				delete defaultDefinedProps[prop];
		};

		// fill in remaining
		const schema = this.schema; 
		for(let prop in defaultDefinedProps)
			entry[prop] = schema[prop].defaultValue;
		
		return entry;
	}

	/**
	 * get an entry by key and value
	 * NOTE: if key is the unique indexing property, then retrieval by value will be quicker
	 * @param key: string -- key to compare value to for entry retrieval
	 * @param value: value to match entry with
	 * @param multi: boolean -- true if return in array form (return all matching entries)
	 * @return matching entry/entries if found. undefined otherwise
	 */ 
	_get(key, value, multi) {
		if (key === this.indexingProp) {
			return multi? (this.entries.get(value) && [this.entries.get(value)]): this.entries.get(value);
		} else {
			let returner = multi && [];
			const entries = this.entries.entries();
			for (let entry of entries) {
				if (key in entry[1] && entry[1][key] === value) {
					if (!multi)
						return entry[1];
					returner.push(entry[1]);
				}
			}
			return returner;
		};
		return;
	}

	/**
	 * validate format of a schema object
	 * @param schema: object -- schema
		EX:
			{
				"name": {
					"type": "string",
					"required": true,
					"defaultValue": "Monet",
				},
				"emailAdresses": {
					"type": "[string]",
					"required": true,
				},
				"preferredOpera": {
					"type": "object",
					"required": false,
				},
			}
		NOTE:
			> valid types are: 'string', 'object', 'boolean', 'number'
			> types can be wrapped in arrays using square bracket wrappers (EX. '[string]')
	 * @param requiredProps: optional [String] - list of fields required to be defined in schema
	 * @return true if valid
	 */
	static validateSchema(schema, requiredProps = []) {
		if (typeof schema != "object" && !Array.isArray(schema)) {
			return false;
		};
		if (!Array.isArray(requiredProps) || requiredProps.reduce((accum, str) => {
			return accum || typeof str != "string";
		}, false)) {
			return false;
		};
		
		const validTypes = new Set(["string", "object", "number", "boolean", "[string]", "[object]", "[number]", "[boolean]" /*, not used: "symbol", "function"*/]);
		let requiredItems = requiredProps.reduce((accum, itemName) => {
			accum[itemName] = true;
			return accum;
		}, {}); // copy array into object for quick match and to ensure original param is not mutatedf

		for (let prop in schema) {
			let propDefinition = schema[prop];
			if (typeof propDefinition != "object" || Array.isArray(propDefinition))
				return false;
			if (!validTypes.has(propDefinition.type))
				return false;
			if (typeof propDefinition.required !== "boolean" && typeof propDefinition.required !== "undefined")
				return false;
			if (typeof propDefinition.defaultValue != "undefined" && !validTypes.has(typeof propDefinition.defaultValue))
				return false;
			if (prop in requiredItems) {
				delete requiredItems[prop];
			};
		};
		return Object.keys(schema).length > 0 && Object.keys(requiredItems).length === 0;
	}

	/**
	 * validate an entry against currently set schema
	 * NOTE: fill the default required properties using _fillDefaultValues(entry) method
	 * @param o: variable to validate against schema
	 * @param collectionInstance: collection to insert o into
	 * @return true if valid
	 */
	static validateAgainstSchema(o, collectionInstance) {
		const schema = collectionInstance.schema;
		if (typeof o != "object" || Array.isArray(o)) return false;

		let requiredPropsWithNoDefaultValues = extend({}, collectionInstance.requiredWithNoDefault);
		let requiredPropsWithDefaultValues = collectionInstance.propsWithDefaults;
		
		for (let prop in o) {
			if (typeof o[prop] == "undefined" && prop in requiredPropsWithDefaultValues)
				continue;

			const propDefinition = schema[prop];
			if (typeof propDefinition == "undefined") return false;

			if (propDefinition.required && (prop in requiredPropsWithNoDefaultValues))
				delete requiredPropsWithNoDefaultValues[prop];
			
			const isArray = propDefinition.type[0] === '[';
			const type = isArray ? propDefinition.type.slice(1, -1) : propDefinition.type;
			const propValue = o[prop];
			if (isArray) {
				if (!Array.isArray(propValue)) return false;
				for(let item of propValue) {
					if(typeof item != type) return false;
				}
			} else if (typeof propValue != type) {
				return false;
			};

		};
		if (Object.keys(requiredPropsWithNoDefaultValues).length) return false;
		return true;
	}
}