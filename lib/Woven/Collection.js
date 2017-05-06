'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../helpers/utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var uuid = require('uuid');
var extend = require('util')._extend;

var Collection = function () {
	/**
  * @param name: unique name for collection
  * @param schema: schema definition for validation in colleciton
  * @param indexByProp: unique index for each collection entry. this is going to be required.
  * @throws Error if invalid schema
  * @throws Error if unexpected error initializing page with unique id
  */
	function Collection(name, schema, indexByProp) {
		_classCallCheck(this, Collection);

		this.$name = name;

		this.setSchema(schema);
		this.indexingProp = indexByProp;
		this.entries = new Map();

		this._id = uuid();

		var insertionAttempt = _utils.Collector.addCollection(this);
		if (!insertionAttempt) throw new Error(`Unexpected error initializing ${this.constructor.name} class with name ${name}. Ensure a collection with the same name has not already been created.`);
	}

	_createClass(Collection, [{
		key: 'validateSchema',


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
   * @return true if valid
   */
		value: function validateSchema(schema) {
			if (typeof schema != "object" && !Array.isArray(schema)) return false;
			var validTypes = new Set(["string", "object", "number", "boolean", "[string]", "[object]", "[number]", "[boolean]" /*, not used: "symbol", "function"*/]);
			for (var prop in schema) {
				var propDefinition = schema[prop];
				if (!validTypes.has(propDefinition.type)) return false;
				if (propDefinition.required !== true && propDefinition.required !== false && propDefinition.required !== undefined) return false;
				if (typeof propDefinition.defaultValue != "undefined" && !validTypes.has(typeof propDefinition.defaultValue)) return false;
			};
			return true;
		}

		/*
   * update schema
   * @param schema: object -- schema
   * @throws Error if invalid schema
   * @return old schema
   */

	}, {
		key: 'setSchema',
		value: function setSchema(schema) {
			if (!this.validateSchema(schema)) throw new Error(`Invalid schema: ${schema}`);

			var old = this.schema;
			this.schema = schema;

			var propBreakdown = Object.keys(schema).reduce(function (accum, prop) {
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
   * validate an entry against currently set schema
   * NOTE: fill the default required properties using fillDefaultValues(entry) method
   * @param o: variable to validate against schema
   * @return true if valid
   */

	}, {
		key: 'validateAgainstSchema',
		value: function validateAgainstSchema(o) {
			var schema = this.schema;
			if (typeof o != "object" || Array.isArray(o)) return false;

			var requiredPropsWithNoDefaultValues = extend({}, this.requiredWithNoDefault);

			for (var prop in o) {
				var propDefinition = schema[prop];
				if (typeof propDefinition == "undefined") return false;

				if (propDefinition.required && prop in requiredPropsWithNoDefaultValues) delete requiredPropsWithNoDefaultValues[prop];

				var isArray = propDefinition.type[0] === '[';
				var type = isArray ? propDefinition.type.slice(1, -1) : propDefinition.type;
				var propValue = o[prop];
				if (isArray) {
					if (!Array.isArray(propValue)) return false;
					var _iteratorNormalCompletion = true;
					var _didIteratorError = false;
					var _iteratorError = undefined;

					try {
						for (var _iterator = propValue[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
							var item = _step.value;

							if (typeof item != type) return false;
						}
					} catch (err) {
						_didIteratorError = true;
						_iteratorError = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion && _iterator.return) {
								_iterator.return();
							}
						} finally {
							if (_didIteratorError) {
								throw _iteratorError;
							}
						}
					}
				} else if (typeof propValue != type) {
					return false;
				};
			};
			if (Object.keys(requiredPropsWithNoDefaultValues).length) return false;
			return true;
		}

		/**
   * looks through an entry's properties and fills missing properties with schema-defined default values
   * @param entry: object -- an entry object validated against schema already
   * @return entry object with missing properties filled in using schema-defined defaults
   */

	}, {
		key: 'fillDefaultValues',
		value: function fillDefaultValues(entry) {
			var defaultDefinedProps = extend({}, this.propsWithDefaults);
			for (var prop in entry) {
				if (prop in defaultDefinedProps) delete defaultDefinedProps[prop];
			};

			// fill in remaining
			var schema = this.schema;
			for (var _prop in defaultDefinedProps) {
				entry[_prop] = schema[_prop].defaultValue;
			}return entry;
		}

		/**
   * get an entry by key and value
   * NOTE: if key is the unique indexing property, then retrieval by value will be quicker
   * @param key: string -- key to compare value to for entry retrieval
   * @param value: value to match entry with
   * @param multi: boolean -- true if return in array form (return all matching entries)
   * @return matching entry/entries if found. undefined otherwise
   */

	}, {
		key: 'get',
		value: function get(key, value, multi) {
			if (key === this.indexingProp) {
				return multi ? this.entries.get(value) && [this.entries.get(value)] : this.entries.get(value);
			} else {
				var returner = multi && [];
				var entries = this.entries.entries();
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = entries[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var entry = _step2.value;

						if (key in entry[1] && entry[1][key] === value) {
							if (!multi) return entry[1];
							returner.push(entry[1]);
						}
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}

				return returner;
			};
			return multi && [];
		}

		/**
   * find an entry
   * @param matchObj: object - with one property (key), and associated value to retrieve entry by
   * @return matching entry or undefined
   */

	}, {
		key: 'findOne',
		value: function findOne(matchObj) {
			var key = Object.keys(matchObj)[0];
			return this.get(key, matchObj[key]);
		}

		/**
   * find all entries
   * @param matchObj: object - with one property (key), and associated value to retrieve entry by
   * @return array of matching entries or undefined
   */

	}, {
		key: 'find',
		value: function find(matchObj) {
			var key = Object.keys(matchObj)[0];
			return this.get(key, matchObj[key], true);
		}

		/**
   * @return iterable of all entries stored in collection
   */

	}, {
		key: 'findAll',
		value: function findAll() {
			return Array.from(this.entries.values());
		}

		/**
   * insert entry to collection
   * @param o: item to insert into collection
   * @throws Error if item does not validate against collection's schema
   * @return previous entry with the same value for its 'indexingProp' if exists
   */

	}, {
		key: 'insert',
		value: function insert(o) {
			if (!this.validateAgainstSchema(o)) throw new Error(`Invalid insertion item. ${o}`);
			var key = o[this.indexingProp];
			return this.entries.set(key, this.fillDefaultValues(o));
		}

		/**
   * remove entry from collection
   * NOTE: removal would be quicker if key is the unique indexing property
   * @param key: key to match value with
   * @param value: value to match against
   * @return deleted entry or undefined
   */

	}, {
		key: 'remove',
		value: function remove(key, value) {
			if (key === this.indexingProp) {
				return this.entries.delete(value);
			} else {
				var entries = this.entries.entries();
				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					for (var _iterator3 = entries[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						var entry = _step3.value;

						if (entry[0] == key && entry[1] == value) return this.entries.delete(entry[this.indexingProp]);
					}
				} catch (err) {
					_didIteratorError3 = true;
					_iteratorError3 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion3 && _iterator3.return) {
							_iterator3.return();
						}
					} finally {
						if (_didIteratorError3) {
							throw _iteratorError3;
						}
					}
				}
			};
			return;
		}
	}, {
		key: 'id',
		get: function get() {
			return this._id;
		}
	}, {
		key: 'name',
		get: function get() {
			return this.$name;
		}
	}]);

	return Collection;
}();

exports.default = Collection;