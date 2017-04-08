const uuid = require('uuid');

class Collection {
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

	validateSchema(schema) {
		if (typeof schema != "object" && !Array.isArray(schema))
			return false;
		const validTypes = new Set(["string", "object", "number", "boolean", "[string]", "[object]", "[number]", "[boolean]" /*, not used: "symbol", "function"*/]);
		for (let propDefinition of schema) {
			if (!validTypes.has(propDefinition.type))
				return false;
			if (propDefinition.optional !== true && propDefinition.optional !== false && propDefinition.optional !== undefined)
				return false;
			if (typeof propDefinition.defaultValue != "undefined" && !validTypes.has(typeof propDefinition.defaultValue))
				return false;
		};
		return true;
	}

	setSchema(schema) {
		if(!this.validateSchema(schema)) throw new Error(`Invalid schema: ${schema}`);;
		const old = this.schema;
		this.schema = schema;
		return old;
	}

	validateAgainstSchema(o) {

	}

	get(key, value) {
		if (key === this.indexingProp) {
			return this.entries.get(value);
		} else {
			const entries = this.entries.entries();
			for (let entry of entries) {
				if (entry[0] == key && entry[1] == value)
					return true;
			}
		};
		return;
	}

	findOne(matchObj) {
		const key = Object.keys(matchObj)[0];
		return this.get(key, matchObj[key]);
	}

	findAll() {
		return this.entries.values();
	}

	insert(o) {
		if (!this.validateAgainstSchema(o))
			throw new Error('Invalid insertion item.');
		const key = o[this.indexingProp];
		return this.entries.set(key, o);
	}

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