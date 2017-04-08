const uuid = require('uuid');

class Collection {
	constructor(name, schema, indexByProp) {
		this._id = uuid();

		this.$name = name;
		this.setSchema(schema);
		this.indexingProp = indexByProp;
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
			if (propDefinition.optional !== true || propDefinition.optional !== false || propDefinition.optional !== undefined)
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

	get(entryIdx) {

	}

	findOne(matchObj) {

	}

	findAll() {

	}

	insert(o) {

	}

	remove(entryIdx) {

	}
}


class CollectionEntry {
	constructor(data, parentCollection) {
		
	}

	data() {

	}

	get(propname) {

	}

	parent() {
		
	}

	get id() {
		
	}
}