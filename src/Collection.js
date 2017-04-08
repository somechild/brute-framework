const uuid = require('uuid');

class Collection {
	/**
	 * @param name: unique name for collection
	 * @param schema: schema definition for validation in colleciton
	 * @param indexByProp: unique index for each collection entry. this is going to be required.
	 * @throws Error if invalid schema
	 */
	constructor(name, schema, indexByProp) {
		this._id = uuid();

		this.$name = name;
		this.setSchema(schema);
		this.indexingProp = indexByProp;
		this.entries = new Map();
	}

	get id() {
		return this._id;
	}

	get name() {
		return this.$name;
	}

	/**
	 * validate formate of a schema object
	 * @param schema: object -- schema
		EX.
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
	 * @return true if valid
	 */
	validateSchema(schema) {
		if (typeof schema != "object" && !Array.isArray(schema))
			return false;
		const validTypes = new Set(["string", "object", "number", "boolean", "[string]", "[object]", "[number]", "[boolean]" /*, not used: "symbol", "function"*/]);
		for (let propDefinition of schema) {
			if (!validTypes.has(propDefinition.type))
				return false;
			if (propDefinition.required !== true && propDefinition.required !== false && propDefinition.required !== undefined)
				return false;
			if (typeof propDefinition.defaultValue != "undefined" && !validTypes.has(typeof propDefinition.defaultValue))
				return false;
		};
		return true;
	}

	/*
	 * update schema
	 * @param schema: object -- schema
	 * @throws Error if invalid schema
	 * @return old schema
	 */
	setSchema(schema) {
		if(!this.validateSchema(schema)) throw new Error(`Invalid schema: ${schema}`);;
		const old = this.schema;
		this.schema = schema;
		return old;
	}

	/**
	 * validate an entry against currently set schema
	 */
	validateAgainstSchema(o) {

	}

	/**
	 * get an entry by key and value
	 * Note: if key is the unique indexing property, then retrieval by value will be quicker
	 * @param key: string -- key to compare value to for entry retrieval
	 * @param value: value to match entry with
	 * @return matching entry if found. undefined otherwise
	 */ 
	get(key, value) {
		if (key === this.indexingProp) {
			return this.entries.get(value);
		} else {
			const entries = this.entries.entries();
			for (let entry of entries) {
				if (entry[0] == key && entry[1] == value)
					return entry;
			}
		};
		return;
	}

	/**
	 * find an entry
	 * @param matchObj: object - with one property (key), and associated value to retrieve entry by
	 * @return matching entry or undefined
	 */
	findOne(matchObj) {
		const key = Object.keys(matchObj)[0];
		return this.get(key, matchObj[key]);
	}

	/**
	 * @return iterable of all entries stored in collection
	 */
	findAll() {
		return this.entries.values();
	}

	/**
	 * insert entry to collection
	 * @param o: item to insert into collection
	 * @throws Error if item does not validate against collection's schema
	 * @return previous entry with the same value for its 'indexingProp' if exists
	 */
	insert(o) {
		if (!this.validateAgainstSchema(o))
			throw new Error(`Invalid insertion item. ${o}`);
		const key = o[this.indexingProp];
		return this.entries.set(key, o);
	}

	/**
	 * remove entry from collection
	 * Note: removal would be quicker if key is the unique indexing property
	 * @param key: key to match value with
	 * @param value: value to match against
	 * @return deleted entry or undefined
	 */
	remove(key, value) {
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
}