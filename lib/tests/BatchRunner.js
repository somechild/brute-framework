"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * this method is poorly designed as it specifically tailors to TestWrapper
 * it's that bad part of OOP where you break up a big thing into smaller parts unecessarily complicating things imo
 * but i'm going to do this anyways for shits
 */

var BatchRunner = function () {

	/**
  * @param wrapper: class to wrap every queued process in
  * @param wrapperArgs: Array - optional array of arguments to pass in addition to a process as the first arg when wrapping
  */
	function BatchRunner(wrapper, wrapperArgs) {
		_classCallCheck(this, BatchRunner);

		this.wrapper = wrapper;
		this.wrapperRunArgs = Array.isArray(wrapperArgs) ? wrapperArgs : [];
		this.processes = [];
	}

	/**
  * queue process for execution
  * NOTE: if 'wrapper' has been defined in the constructor - the process must return an object with an isSuccess boolean proeprty
  * @param processItem: function || object -- method to queue. if to wrapper is defined, this should be an object with main, success and failed methods
  */


	_createClass(BatchRunner, [{
		key: "queue",
		value: function queue(processItem) {
			var toAdd = processItem;
			if (typeof this.wrapper != "undefined") {
				toAdd = new (Function.prototype.bind.apply(this.wrapper, [null].concat([toAdd], _toConsumableArray(this.wrapperRunArgs))))();
			};
			this.processes.push(toAdd);
		}

		/**
   * run the queued processes
   * TODO: use async threads
   */

	}, {
		key: "run",
		value: function run() {
			if (typeof this.wrapper != "undefined") {
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = this.processes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var processItem = _step.value;

						var _processItem$main = processItem.main(),
						    isSuccess = _processItem$main.isSuccess,
						    message = _processItem$main.message;

						if (isSuccess) {
							processItem.success();
						} else {
							processItem.failed(message);
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
			} else {
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = this.processes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var _processItem = _step2.value;

						_processItem();
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
		}
	}]);

	return BatchRunner;
}();

exports.default = BatchRunner;