"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var uuid = require('uuid');

var Collection = function () {
	function Collection(name, schema, indexByProp) {
		_classCallCheck(this, Collection);

		this._id = uuid();

		this.$name = name;
		this.setSchema(schema);
		this.indexingProp = indexByProp;
		this.entries = new Map();
	}

	_createClass(Collection, [{
		key: "validateSchema",
		value: function validateSchema(schema) {
			if (typeof schema != "object" && !Array.isArray(schema)) return false;
			var validTypes = new Set(["string", "object", "number", "boolean", "[string]", "[object]", "[number]", "[boolean]" /*, not used: "symbol", "function"*/]);
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = schema[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var propDefinition = _step.value;

					if (!validTypes.has(propDefinition.type)) return false;
					if (propDefinition.optional !== true && propDefinition.optional !== false && propDefinition.optional !== undefined) return false;
					if (typeof propDefinition.defaultValue != "undefined" && !validTypes.has(typeof propDefinition.defaultValue)) return false;
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

			;
			return true;
		}
	}, {
		key: "setSchema",
		value: function setSchema(schema) {
			if (!this.validateSchema(schema)) throw new Error(`Invalid schema: ${schema}`);;
			var old = this.schema;
			this.schema = schema;
			return old;
		}
	}, {
		key: "validateAgainstSchema",
		value: function validateAgainstSchema(o) {}
	}, {
		key: "get",
		value: function get(key, value) {
			if (key === this.indexingProp) {
				return this.entries.get(value);
			} else {
				var entries = this.entries.entries();
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = entries[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var entry = _step2.value;

						if (entry[0] == key && entry[1] == value) return true;
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
			};
			return;
		}
	}, {
		key: "findOne",
		value: function findOne(matchObj) {
			var key = Object.keys(matchObj)[0];
			return this.get(key, matchObj[key]);
		}
	}, {
		key: "findAll",
		value: function findAll() {
			return this.entries.values();
		}
	}, {
		key: "insert",
		value: function insert(o) {
			if (!this.validateAgainstSchema(o)) throw new Error('Invalid insertion item.');
			var key = o[this.indexingProp];
			return this.entries.set(key, o);
		}
	}, {
		key: "remove",
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
		key: "id",
		get: function get() {
			return this._id;
		}
	}, {
		key: "name",
		get: function get() {
			return this.$name;
		}
	}]);

	return Collection;
}();