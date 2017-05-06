'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../helpers/utils');

var _constants = require('../helpers/constants');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var uuid = require('uuid');

var Pattern = function () {
	/**
  * @param pattern: object - pattern to wrap in an instance of this class
  * 				  NOTE: this is an object whose fields are the unique endpoints of a route, and values are the value in the endpoint request
  * 				  ex. if data is to be queried by the 'name' field specified in design (uniqueBy), the pattern will look like this (sample route request may be: '/users?name=John||Jane' or '/users/name/John||Jane')
  * 					 {
 						"users": "John||Jane",
 					 }
  * @throws Error if pattern is invalid
  * @throws Error if unexpected error initializing page with unique id
  */
	function Pattern(pattern) {
		_classCallCheck(this, Pattern);

		this._id = uuid();

		this.pattern = pattern;
		if (!Pattern.validate(this)) throw new Error(`Invalid pattern: ${pattern}`);

		var insertionAttempts = _constants.maxWovenInsertionAttempts;
		while (!_utils.Weaver.insert(this) && insertionAttempts-- > 0) {
			this._id = uuid();
		}if (!insertionAttempts) throw new Error('Unexpected error initializing ${this.constructor.name} class with pattern ${pattern}');
	}

	/**
  * @return pattern wrapped in the instance of this class
  */


	_createClass(Pattern, [{
		key: 'stringify',


		/**
   * NOTE: this is effectively a hashcode
   * @return alphabetically sorted string representation of pattern wrapped by the instance of this class
   */
		value: function stringify() {
			var o = "";
			var sortedProps = Object.keys(this.pattern).sort();
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = sortedProps[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var prop = _step.value;

					o += `${prop}:${this.pattern[prop]}`;
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

			return o;
		}

		/**
   * @param o: variable to validate
   * @return true if variable is a valid instance of the Pattern class and is wrapping a valid pattern
   */

	}, {
		key: 'breakdown',
		get: function get() {
			return this.pattern;
		},


		/**
   * @param newPattern: object - new pattern to replace pattern currently wrapped by the instance of this class
   * @throws Error if new pattern is invalid & reverts class instance to old pattern
   * @return old pattern
   */
		set: function set(newPattern) {
			var old = this.pattern;
			this.pattern = newPattern;
			if (!Pattern.validate(this)) {
				this.pattern = old;
				throw new Error(`Invalid pattern: ${pattern}`);
			};
			return old;
		}
	}, {
		key: 'id',
		get: function get() {
			return this._id;
		}
	}], [{
		key: 'validate',
		value: function validate(o) {
			if (!(o instanceof Pattern)) return false;
			var breakdown = o.breakdown;
			if (typeof breakdown != "object" || Array.isArray(breakdown)) return false;
			for (var prop in breakdown) {
				if (typeof breakdown[prop] != "string") return false;
			}
			return true;
		}

		/**
   * parses results from CollectionQuerier (ExpressionEvaluator), based on an original match expression for inserting into properties of a data instance of DataModel & required items for this section as per design requirements
   * --> data instances will later be used by handlebars on the HTML templates
   * @param matchObj: object{matches, originalExpression, items} - matches is an Array of results retrieved from CollectionQuerier, originalExpression is a string with the expression used to retrieve aforementioned matches, items is an array of names of required properties to retrieve from the collection
   * @return unwrapped and flattened array or single collection entry instance (if no AND or COMBINE logic used in originalExpression)
   */

	}, {
		key: 'parseResults',
		value: function parseResults(matchObj) {
			var matches = matchObj.matches,
			    originalExpression = matchObj.originalExpression,
			    items = matchObj.items;

			var queryDoesNotExpectArray = originalExpression.indexOf('*') != -1 ? false : originalExpression.split('').reduce(function (accum, current, idx) {
				return accum && !((current == '&' || current == '^') && current == originalExpression[i + 1]);
			}, true);

			var o = {};
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = items[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var item = _step2.value;

					if (queryDoesNotExpectArray && matches[0]) {
						o[item] = matches[0][item];
					} else {
						o[item] = [];
						var _iteratorNormalCompletion3 = true;
						var _didIteratorError3 = false;
						var _iteratorError3 = undefined;

						try {
							for (var _iterator3 = matches[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
								var match = _step3.value;

								if (typeof match != "undefined") {
									o[item].push(match[item]);
								};
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

			return o;
		}
	}]);

	return Pattern;
}();

exports.default = Pattern;