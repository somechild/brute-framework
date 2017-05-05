"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ErrorCollector = exports.Assertions = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require("../helpers/utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Assertions = exports.Assertions = function () {
	function Assertions() {
		_classCallCheck(this, Assertions);
	}

	_createClass(Assertions, [{
		key: "equals",

		/**
   * public methods for assertions
   * @throws Error if failure & 'enableErrorThrows' has been called
   * @return void if success
   * @return String if failure
   */

		/**
   * @param weakEquality: true if expected and result should be compared with two equal signs OR if they are objects, to compare them with a deep match
   */
		value: function equals(expected, result, message, weakEquality) {
			if (!weakEquality && expected === result || weakEquality && expected == result) {
				return;
			} else if (weakEquality && typeof expected == "object" && typeof result == "object" && (0, _utils.deepMatch)(expected, result)) {
				return;
			} else {
				return this._handleFailure(message || `${expected} does not equal ${result}`);
			};
		}
	}, {
		key: "truthy",
		value: function truthy(result, message) {
			if (result) {
				return;
			} else {
				return this._handleFailure(message || `${result} is not truthy`);
			};
		}
	}, {
		key: "falsey",
		value: function falsey(result, message) {
			if (result == false) {
				return;
			} else {
				return this._handleFailure(message || `${result} is not truthy`);
			};
		}

		/**
   * call to have failures result in errors being thrown
   * overrides collectErrors
   */

	}, {
		key: "enableErrorThrows",
		value: function enableErrorThrows() {
			this.toThrow = true;
		}

		/**
   * collect all errors within collector
   * @param collector - a new collector of type ErrorCollector
   * @throws Error if collector is not of type ErrorCollector
   */

	}, {
		key: "collectErrors",
		value: function collectErrors(collector) {
			if (!(collector instanceof ErrorCollector)) throw new Error(`${collector} is not of class type ErrorCollector`);
			this.toCollect = true;
			this.collector = collector;
		}

		/** 
   * depending on enable error throws being called or not, throw error or return message
   */

	}, {
		key: "_handleFailure",
		value: function _handleFailure(message) {
			if (this.toThrow) {
				throw new Error(message);
			} else if (this.toCollect) {
				this.collector.add(message);
			} else {
				return message;
			};
		}
	}]);

	return Assertions;
}();

var ErrorCollector = exports.ErrorCollector = function () {
	function ErrorCollector() {
		_classCallCheck(this, ErrorCollector);

		this.messages = [];
	}

	/**
  * @param message: String - error message to add
  * @throws Error if message is not of type string
  */


	_createClass(ErrorCollector, [{
		key: "add",
		value: function add(message) {
			if (typeof message != "string") throw new Error(`${message} should be of type String`);

			this.messages.push(message);
		}

		/**
   * @return [string]: copy of 'this.messages'
   */

	}, {
		key: "printErrors",


		/**
   * @param formatted: boolean - true if color format printed errors
   */
		value: function printErrors(formatted) {
			if (!formatted) this.messages.forEach(function (message) {
				return console.log(message);
			});else this.messages.forEach(function (message) {
				return console.log('\x1b[31m', `Error: ${message}`);
			});
			console.log('\x1b[0m', '\n'); // clear console font color from red
		}
	}, {
		key: "errors",
		get: function get() {
			return this.messages.slice();
		}
	}]);

	return ErrorCollector;
}();