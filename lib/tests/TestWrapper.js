'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TestWrapper = function () {
	/**
  * @param test: object containing:
  * 				> body: function - method to run the test
  * 				> path: string - test sub-directory-path to the test
  * 				> name: string - name of test
  * @param isVerbose: true for a verbose console report
  */
	function TestWrapper(test, isVerbose) {
		_classCallCheck(this, TestWrapper);

		this.main = test.body;
		this.testpath = test.path;
		this.testname = test.name;
		this.isVerbose = isVerbose;
	}

	_createClass(TestWrapper, [{
		key: 'success',
		value: function success() {
			if (isVerbose) {
				console.log('\x1b[32m', `${this.testpath}\n${this.testname} completed successfully.\n`);
			};
		}

		/**
   * @message: returned result of failed test
   */

	}, {
		key: 'failed',
		value: function failed(message) {
			console.log('\x1b[31m', `${this.testpath}\n${this.testname} failed`);
			if (isVerbose) {
				console.log('\x1b[31m', ' with result:\n');
				console.log('\x1b[31m', message);
				console.log('\n');
			};
		}
	}], [{
		key: 'relativepath',
		value: function relativepath() {
			return '../';
		}
	}]);

	return TestWrapper;
}();

exports.default = TestWrapper;