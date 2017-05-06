'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Weaver = exports.TemplateProcessor = exports.Collector = exports.DefaultTemplates = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.checkNotEmptyIfArray = checkNotEmptyIfArray;
exports.deepMatch = deepMatch;
exports.easymerge = easymerge;
exports.findByProp = findByProp;
exports.getConfigs = getConfigs;
exports.getSafe = getSafe;
exports.println = println;
exports.unwrap = unwrap;

var _ExpressionEvaluator = require('./ExpressionEvaluator');

var _Collection = require('../Woven/Collection');

var _Collection2 = _interopRequireDefault(_Collection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var uuid = require('uuid');
var cheerio = require('cheerio');
var handlebars = require('handlebars');

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
 * to add and remove entries from collections
 */

var Collector = exports.Collector = function () {
	function Collector() {
		_classCallCheck(this, Collector);
	}

	_createClass(Collector, null, [{
		key: 'initializeSpace',

		/**
   * initialize collection space on the global bruteframework space
   * @return true if initialized. false if already exists
   */
		value: function initializeSpace() {
			if (!global.bruteframework) global.bruteframework = {};
			if (!global.bruteframework.collections) {
				global.bruteframework.collections = {};
				return true;
			}
			return false;
		}

		/**
   * add collection to collection space
   * @param instance: object -- instance of Collection to add to space
   * @return true if added. false if collection space has not been initialized OR if collection already exists with same name.
   */

	}, {
		key: 'addCollection',
		value: function addCollection(instance) {
			var collectionSpace = getSafe(global, 'bruteframework.collections');
			if (!collectionSpace) return console.log('collection space has not yet been initialized.') && false;
			if (collectionSpace[instance.name] instanceof _Collection2.default) return console.log(`Collection with name ${instance.name} already exists.`) && false;
			collectionSpace[instance.name] = instance;
			return true;
		}

		/**
   * remove collection from collection space
   * @param collectionName: string -- unique name of collection to drop
   * @return true if successfully deleted. false if collection space has not been initialized or if there is no collection with matching name to delete.
   */

	}, {
		key: 'dropCollection',
		value: function dropCollection(collectionName) {
			var collectionSpace = getSafe(global, 'bruteframework.collections');
			if (!collectionSpace) return console.log('collection space has not yet been initialized.') && false;
			if (typeof collectionSpace[collectionName] == "undefined") return console.log(`Collection with name ${collectionName} does not exist`) && false;

			delete collectionSpace[collectionName];
			return true;
		}

		/**
   * @return new instance of 'CollectionQuerier'
   */

	}, {
		key: 'getQuerier',
		value: function getQuerier() {
			return new CollectionQuerier();
		}
	}]);

	return Collector;
}();

/**
 * to query collections
 */


var CollectionQuerier = function () {
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
  * @return self for method chaining
  */


	_createClass(CollectionQuerier, [{
		key: 'with',
		value: function _with(collectionName) {
			var collection = void 0;
			if (typeof collectionName != "string" || !(collection = getSafe(global, `bruteframework.collections.${collectionName}`))) throw new Error("Collection with name '${collectionName}' does not exist.");

			this.context = collection;

			return this;
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
		key: 'find',
		value: function find(queryObj) {
			if (this.context instanceof _Collection2.default && typeof queryObj == "object" && Object.keys(queryObj).length === 1) {
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

/**
 * To process templates
 */

var TemplateProcessor = exports.TemplateProcessor = function () {
	/**
  * @param template
  * @throws Error if invalid template format
  */
	function TemplateProcessor(template) {
		_classCallCheck(this, TemplateProcessor);

		this._id = uuid();
		this.setTemplate(template);
	}

	_createClass(TemplateProcessor, [{
		key: 'setTemplate',


		/**
   * @param template
   * @throws Error if invalid template format
   * @return old template
   */
		value: function setTemplate(template) {
			if (!TemplateProcessor.validateTemplate(template)) throw new Error('Invalid template format');
			var old = this.template;
			this.template = template;
			return old;
		}

		/**
   * @param data
   * @return string: template context processed with data
   */

	}, {
		key: 'processWith',
		value: function processWith(data) {
			var compiledTemplate = handlebars.compile(this.template);
			return compiledTemplate(data);
		}

		/**
   * @param template
   * @return true if valid template
   */

	}, {
		key: 'id',
		get: function get() {
			return this._id;
		}
	}], [{
		key: 'validateTemplate',
		value: function validateTemplate(template) {
			var returner = void 0;
			try {
				var compiledTemplate = handlebars.compile(template);
				var data = {};
				returner = compiledTemplate(data) && true;
			} catch (e) {
				console.log(e.message + '\n');
				console.log(e.stack);
			} finally {
				return returner;
			}
		}
	}]);

	return TemplateProcessor;
}();

/**
 * To manage the woven class instance space
 */


var Weaver = exports.Weaver = function () {
	function Weaver() {
		_classCallCheck(this, Weaver);
	}

	_createClass(Weaver, null, [{
		key: 'initializeSpace',

		/**
   * @param classNames: [string] - list of woven class names to initialize space for
   * @return true if sucessful
   */
		value: function initializeSpace(classNames) {
			if (!global.bruteframework) global.bruteframework = {};
			if (!global.bruteframework.weaveClasses) global.bruteframework.weaveClasses = {};
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = classNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var className = _step.value;

					if (!global.bruteframework.weaveClasses[className]) global.bruteframework.weaveClasses[className] = new Map();else return false;
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

			return true;
		}

		/**
   * @return instance of one of the framework's underlying classes (Route, DataModel, etc.)
   */

	}, {
		key: 'query',
		value: function query(className, classId) {
			return getSafe(global, `bruteframework.weaveClasses.${className}`, function (classInstancesMap) {
				return classInstancesMap.get(classId);
			});
		}

		/**
   * @param instance: object - instance of class to insert
   * @param className: string - name of class that object is instance of
   * @return false if item with same ID if exists in map
   */

	}, {
		key: 'insert',
		value: function insert(instance) {
			var classMap = getSafe(global, `bruteframework.weaveClasses.${instance.constructor.name}`);
			if (!classMap) throw new Error(`Class with name ${instance.constructor.name} does not exist.`);

			if (classMap.get(instance.id)) return false;

			return classMap.set(instance.id, instance) || true;
		}
	}]);

	return Weaver;
}();

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
		for (var prop in temp2) {
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
	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = arguments[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var arg = _step2.value;

			if (Array.isArray(arg)) {
				arg.forEach(function (item) {
					if (typeof item != "undefined") toRet.push(item);
				});
			} else if (typeof arg != "undefined" && (arg instanceof _ExpressionEvaluator.EntryWrapper && typeof arg.value != "undefined" || !(arg instanceof _ExpressionEvaluator.EntryWrapper))) {
				toRet.push(arg);
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
 * @return framework user configurations
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
	if (typeof o != "object" || Array.isArray(o)) return;
	var runner = o;
	var props = str.split('.');
	var _iteratorNormalCompletion3 = true;
	var _didIteratorError3 = false;
	var _iteratorError3 = undefined;

	try {
		for (var _iterator3 = props[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
			var prop = _step3.value;

			if (!(prop in runner)) return;
			runner = runner[prop];
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

	;
	if (executeOnSuccess) return executeOnSuccess(runner);
	return runner;
}

/**
 * prints a string with line breaks above and below
 * @param str: item to print
 */
function println(str) {
	console.log(`\n${str}\n`);
}

/**
 * Unwrap array with non-array items nested in sub-arrays
 * NOTE: this method will also unwrap values from EntryWrapper objects
 * Ex. [['joe', 'jane'], 'jordan', ['jack', ['jill', 'jeff']]] --> ['joe', 'jane', 'jordan', 'jack', 'jill', 'jeff']
 * @param arr: array to unwrap
 * @return unwrapped array
 */
function unwrap(arr) {
	var unwrapped = [];
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] instanceof _ExpressionEvaluator.EntryWrapper) {
			unwrapped.push(arr[i].value);
		} else if (Array.isArray(arr[i])) {
			var temp = unwrap(arr[i]);
			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = temp[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var item = _step4.value;

					unwrapped.push(item);
				}
			} catch (err) {
				_didIteratorError4 = true;
				_iteratorError4 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion4 && _iterator4.return) {
						_iterator4.return();
					}
				} finally {
					if (_didIteratorError4) {
						throw _iteratorError4;
					}
				}
			}
		} else if (typeof arr[i] != "undefined") {
			unwrapped.push(arr[i]);
		}
	};
	return unwrapped;
}