"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.CollectionQuerier = exports.DefaultTemplates = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.checkNotEmptyIfArray = checkNotEmptyIfArray;
exports.deepMatch = deepMatch;
exports.easymerge = easymerge;
exports.findByProp = findByProp;
exports.getConfigs = getConfigs;
exports.getSafe = getSafe;
exports.println = println;
exports.weaveQuery = weaveQuery;

var _ExpressionEvaluator = require("./ExpressionEvaluator");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** Objects & Classes **/
/**
 * fallback templates for 'graceful' failures
 */
var DefaultTemplates = exports.DefaultTemplates = {
	isEmpty() {
		return "<p>A template has not been initialized for this page yet</p>";
	},
	hasError() {
		return "<p>There was an error finding the template for this page</p>";
	}
};

/**
 * to query collections
 */

var CollectionQuerier = exports.CollectionQuerier = function () {
	/**
  * declares context variable
  */
	function CollectionQuerier() {
		_classCallCheck(this, CollectionQuerier);

		this.context = null;
	}

	/**
  * set the context of the proceeding queries
  * @param collectionName: name of the collection the be queried
  * @throws Error if collection with name of 'collectionName' does not exist
  */


	_createClass(CollectionQuerier, [{
		key: "with",
		value: function _with(collectionName) {
			var collection = void 0;
			if (typeof collectionName != "string" || !(collection = getSafe(global, `bruteframework.collections.${collectionName}`))) throw new Error("Collection with name '${collectionName}' does not exist.");

			this.context = collection;
		}

		/**
   * run query on the collection set in context
   * @param queryObj: an object with 1 property
   * 		--> Property name is key to match in collection.
   * 		--> Property value is the expression to evaluate and match
   *		--> ex. {name: "{{john&&jane}}^^{{joe}}||{{jackie}}"} will get the following collection entries:
   				if entries with 'name' set to john and jane both exist, they both will be added to the returned result
   				if an entry with 'name' set to joe exists, that will be added to the returned result
   				if niether john, nor john AND jane exist, fallback to an entry with name set to 'jackie'
   */

	}, {
		key: "find",
		value: function find(queryObj) {
			if (this.context instanceof Colection && typeof queryObj == "object" && Object.keys(queryObj).length === 1) {
				var key = Object.keys(queryObj)[0];
				var expression = queryObj[key];
				if (expression == '*') {
					return this.context.findAll();
				} else {
					return _ExpressionEvaluator.ExpressionEvaluator.evaluate(expression, key, this.context);
				};
			};

			return [];
		}
	}]);

	return CollectionQuerier;
}();

;

/** Methods **/

/**
 * @param o: anything
 * @return true if o is an array and consists of values that are not all undefined
 */
function checkNotEmptyIfArray(o) {
	if (o && Array.isArray(o)) {
		return o.length && o.reduce(function (accum, cur) {
			return accum || typeof cur != "undefined";
		}, false);
	};
	return o;
}

/**
 * match multiple objects by individual property
 * @params: objects to compare
 */
function deepMatch() {
	for (var i = 1; arguments[i]; i++) {
		var temp1 = arguments[i - 1];
		var temp2 = arguments[i];

		if (Object.keys(temp2).length != Object.keys(temp1).length) return false;
		for (prop in temp2) {
			if (temp2[prop] != temp1[prop]) return false;
		}
	}
	return true;
}

/**
 * merges items-into-arrays, merges arrays-with-arrays, and combines multiple items into an array
 * @params: arrays are unwrapped & all other types are treated as 'items'
 * @return items unwrapped from arrays and items passed as parameters are combined into one array and returned
 */
function easymerge() {
	var toRet = [];
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = arguments[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var arg = _step.value;

			if (Array.isArray(arg)) {
				//TODO: change to use a wrapper instance rather than array primitive
				arg.forEach(function (item) {
					if (typeof item != "undefined") toRet.push(item);
				});
			} else if (typeof arg != "undefined" && (arg instanceof _ExpressionEvaluator.EntryWrapper && typeof arg.value != "undefined" || !(arg instanceof _ExpressionEvaluator.EntryWrapper))) {
				toRet.push(arg);
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

	return toRet;
}

/**
 * find an object in an array by property
 * @param arr: array to search in
 * @param prop: property of object in array to check
 * @param val: value the property the object should match
 * @param getIndex: truthy if you wold like method to return index of matched element rather than element itself
 * @return index of matched elment or matched element itself. if fails, return -1 or undefined.
 */
function findByProp(arr, prop, val, getIndex) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i][prop] == val) return getIndex ? arr[i] : i;
	};
	return getIndex && -1;
}

/**
 * get framework user configurations
 */
function getConfigs() {
	return getSafe(global, 'bruteframework.configs');
}

/**
 * safely chain property access in objects
 * @param o: object to operate on
 * @param str: properties to chain access. seperated by a '.' -- ex. 'profile.name.firstName' of a hypothetical 'userObject'
 * @param executeOnSucces: method to run on final value if successfully accessed final property
 * @return value of final property or returned value of executeOnSuccess method if successful. undefined if failed.
 */
function getSafe(o, str, executeOnSuccess) {
	var runner = o;
	var props = str.split('.');
	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = props[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var _prop = _step2.value;

			if (!(_prop in runner)) return;
			runner = runner[_prop];
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

	;
	if (executeOnSuccess) return executeOnSuccess(runner);
	return runner;
}

/**
 * prints a string with line breaks above and below
 */
function println(str) {
	console.log(`\n${str}\n`);
}

/**
 * get instance of one of the framework's underlying classes (Route, DataModel, etc.)
 */
function weaveQuery(className, classId) {
	return getSafe(global, `bruteframework.weaveClasses.${className}`, function (classInstancesMap) {
		return classInstancesMap.get(classId);
	});
}