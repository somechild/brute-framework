"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ExpressionEvaluator = exports.EntryWrapper = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require("./utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EntryWrapper = exports.EntryWrapper = function () {
	// wrap so there are no type conflicts while parsing multiple data
	function EntryWrapper(data) {
		_classCallCheck(this, EntryWrapper);

		this.data = data;
	}

	_createClass(EntryWrapper, [{
		key: "value",
		get: function get() {
			return this.data;
		},
		set: function set(data) {
			var old = this.data;
			this.data = data;
			return old;
		}
	}]);

	return EntryWrapper;
}();

var ExpressionEvaluator = exports.ExpressionEvaluator = function () {
	function ExpressionEvaluator() {
		_classCallCheck(this, ExpressionEvaluator);
	}

	_createClass(ExpressionEvaluator, null, [{
		key: "evaluate",

		/** public methods **/

		/**
   * evaluate an expression string and search against a property in a collection
   * @param expr: String - user defined expression to match against
   * @param matchKey: String - key/property to match expression against
   * @param collectionContext: Collection - collection with matchKey to search expression in
   * @return Array of results
   */
		value: function evaluate(expr, matchKey, collectionContext) {
			var parsedExpr = this.parseBrackets(expr);
			if (typeof parsedExpr == "string") return this.simple(parsedExpr);
			return this.compoundEvalLoop(parsedExpr, matchKey, collectionContext);
		}

		/** private methods **/

		/**
   * evaluate an expression with no brackets
   * @param expr: String - simple expression
   * @param key: String - key to match expression against
   * @param collectionContext: Collection - collection to search in
   * @return Array with result of expression searched in collection 
   */

	}, {
		key: "simple",
		value: function simple(expr, key, collectionContext) {
			var breakdown = [],
			    tempstr = "";
			for (var i = 0; i < expr.length; i++) {
				if ((expr[i] == '&' || expr[i] == '|' || expr[i] == '^') && expr[i] == expr[i + 1]) {
					if (tempstr.length) {
						breakdown.push(tempstr);
						tempstr = "";
					};
					breakdown.push(expr[i] + expr[i + 1]);
					i++;
				} else {
					tempstr += expr[i];
				};
			};

			if (tempstr.length) {
				// this should always be true
				breakdown.push(tempstr);
				tempstr = "";
			} else {
				throw new Error(`Invalid! Expression ends in logical operator: ${expr}`);
			};

			var toRet = [];
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = breakdown[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var item = _step.value;

					if (item != '&&' && item != '||' && item != '^^') {
						var entry = new EntryWrapper(collectionContext.findOne({ [key]: item }));
						toRet.push(entry.value && [entry.value]);
					} else {
						toRet.push(item);
					};

					if (toRet.length == 3) {
						toRet = this.collapseLogic(toRet);
					};
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

			if (toRet.length == 3) return this.collapseLogic(toRet);
			return toRet;
		}

		/**
   * loop to recursively evaluate an expression broken down into arrays and sub-arrays
   * @param parsedExpression: Array - string expression with brackets broken down into arrays and sub-arrays
   * @param key: key to match expression against
   * @param collectionContext: collection to search in
   * @return Array with results of expression evaluated and searched within collection
   */

	}, {
		key: "compoundEvalLoop",
		value: function compoundEvalLoop(parsedExpression, key, collectionContext) {
			var evaluated = [];
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = parsedExpression[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var item = _step2.value;

					if (evaluated.length == 3) {
						evaluated = this.collapseLogic(evaluated);
					};

					if (typeof item == "string") {
						if (item == '&&' || item == '||' || item == '^^') {
							evaluated.push(item);
						} else {
							evaluated.push(this.simple(item, key, collectionContext));
						};
					} else {
						// it's an array
						evaluated.push(this.compoundEvalLoop(item, key, collectionContext));
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

			if (evaluated.length == 3) return this.collapseLogic(evaluated);
			return evaluated;
		}

		/**
   * collapse a logic array into an array with a single item or no items
   	-> for cases of AND and COMBINE which reduce to a single array, if items are arrays, they will be merged
  	-> if you do not want arrays merged, wrap them in an EntryWrapper object
   * AND Ex.
   		[undefined, "&&", {"name": "joe"}] --> []
   		[[], "&&", "joe"] --> []
   		[[undefined], "&&", "joe"] --> []
   		[ "jane", "&&", "joe"] --> [["jane", "joe"]]
   		[["jane", "joe"], "&&", "jack"] --> [["jane", "joe", "jack"]]
   		[["jane", "joe"], "&&", ["jack", "jill"]] --> [["jane", "joe", "jack", "jill"]]
   * OR Ex.
   		[undefined, "||", {"name": "joe"}] --> [{"name": "joe"}]
   		["jane", "||", "joe"] --> ["jane"]
   * COMBINE Ex.
   		[undefined, "^^", {"name": "joe"}] --> [{"name": "joe"}]
   		["jane", "^^", "joe"] --> [["jane", "joe"]]
   		["jane", "^^", ["joe", "jack"]] --> [["jane", "joe", "jack"]]
   * @param logicArray: Array - 3-element array of form [item1, logicalExpressionString, item2]
   *		--> logicalExpressionString: '&&' is logical AND, '||' is logical OR, '^^' is a combining operation (combines all defined items)
   * @return empty array if logical AND is not true. array with first elemnt being an array of items if ^^ or && used. array with either item1 or item2 as the first element if || used.
   */

	}, {
		key: "collapseLogic",
		value: function collapseLogic(logicArray) {
			var collapsed = void 0;
			var first = (0, _utils.checkNotEmptyIfArray)(logicArray[0]),
			    second = (0, _utils.checkNotEmptyIfArray)(logicArray[2]);
			if (logicArray[1] == '^^' || logicArray[1] == '&&' && first && second) {
				collapsed = [(0, _utils.easymerge)(logicArray[0], logicArray[2])];
			} else if (logicArray[1] == '||' && (first || second)) {
				collapsed = [first ? (0, _utils.easymerge)(logicArray[0]) : (0, _utils.easymerge)(logicArray[2])];
			} else {
				collapsed = [];
			};
			return collapsed;
		}

		/**
   * recursively parse string with brackets to an array with nested arrays for sub-expressions (break down to simplest of expressions)
   * Ex. "{{foo&&{{bar||foobar}}}}^^baz" --> [["foo, "&&", ["bar||foobar"]], "^^", "baz"]
   * @param str: string with brackets '{{', '}}' to parse into arrays and nested sub-arrays
   * @return original str if no brackets are in str. else Array with nested arrays and broken down expressions
   */

	}, {
		key: "parseBrackets",
		value: function parseBrackets(str) {
			var parsedResult = this.parseShallowBrackets(str);
			if (typeof parsedResult == "string") return str;
			for (var i = 0; i < parsedResult.length; i++) {
				if (Array.isArray(parsedResult[i])) {
					parsedResult[i] = this.parseBrackets(parsedResult[i][0]);
				};
			}
			return parsedResult;
		}

		/**
   * parse the first level of brackets - ignoring nested brackets
   * Ex. "{{foo&&{{bar||foobar}}}}^^baz" --> [["foo&&{{bar||foobar}}"], "^^", "baz"]
   * @param str: string with expressions nested using brackets
   * @return Array with shallowly parsed brackets or original str if no brackets found
   */

	}, {
		key: "parseShallowBrackets",
		value: function parseShallowBrackets(str) {
			var stack = [],
			    breakdown = [],
			    isCompound = void 0;
			var tempStr = '';
			for (var i = 0; i < str.length; i++) {
				if (str[i] == '{' && str[i + 1] == '{') {
					isCompound = true;
					stack.push(i);
					i++;
					if (tempStr.length) {
						breakdown.push(tempStr);
						tempStr = '';
					};
				} else if (str[i] == '}' && str[i + 1] == '}') {
					var start = stack.pop();
					if (stack.length == 0) {
						breakdown.push([str.substring(start + 2, i)]);
					};
					i++;
				} else if (stack.length == 0) {
					if ((str[i] == '|' || str[i] == '&' || str[i] == '^') && str[i] == str[i + 1]) {
						// todo check for character escaping
						if (tempStr.length) {
							breakdown.push(tempStr);
							tempStr = '';
						};
						breakdown.push(str[i] + str[i + 1]);
						i++;
					} else {
						tempStr += str[i];
					};
				};
			}
			if (tempStr.length) {
				breakdown.push(tempStr);
				tempStr = '';
			};
			return isCompound ? breakdown : str;
		}
	}]);

	return ExpressionEvaluator;
}();