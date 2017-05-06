"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = describe;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _path_ = require('path');

/**
 * @param configs: both fields required: testName (string), testedFilePath (string) - path to file being tested
 * @return new TestCreationWrapper with testName and testedFilePath configured
 */
function describe(configs) {
	var testName = configs.testName,
	    testedFilePath = configs.testedFilePath;

	return new TestCreationWrapper(testName, testedFilePath);
}

var TestCreationWrapper = function () {
	/**
  * create wrapper with required testName and testedFilePath
  * normalizes file path
  * @param testName: string -  name of test set
  * @param testedFilePath: string - path to file being tested (will be later noramlized)
  * @throws Error if params invalid
  */
	function TestCreationWrapper(testName, testedFilePath) {
		_classCallCheck(this, TestCreationWrapper);

		if (typeof testName != "string" || typeof testName != typeof testedFilePath) throw new Error(`Invalid config {testName: ${testName}, testedFilePath: ${testedFilePath}}. Valid test name and tested file path must be provided in order to generate a test.`);
		this.name = testName;
		this.path = _path_.normalize(testedFilePath);
		this.tests = [];
	}

	/**
  * adds test to wrapper
  * @param testBody: function - body of test
  * @throws Error if params invalid
  */


	_createClass(TestCreationWrapper, [{
		key: "addTest",
		value: function addTest(testBody) {
			if (typeof testBody != "function") throw new Error(`${testBody} is not a valid test. Tests must be functions.`);
			this.tests.push(testBody);
		}
	}, {
		key: "finalize",


		/**
   * @return properly formatted array of tests to be tested by BatchRunner/TestWrapper classes in the index.js files
   */
		value: function finalize() {
			var name = this.name,
			    path = this.path;

			return this.tests.map(function (body) {
				return { name, path, body };
			});
		}
	}]);

	return TestCreationWrapper;
}();