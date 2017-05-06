'use strict';

var _BatchRunner = require('./BatchRunner');

var _BatchRunner2 = _interopRequireDefault(_BatchRunner);

var _TestWrapper = require('./TestWrapper');

var _TestWrapper2 = _interopRequireDefault(_TestWrapper);

var _utils = require('../helpers/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _path_ = require('path');

// create framework space in global scope
/**
 * this directory should mirror all other folders in parent directory and tests can be written for individual js files
 * test files should have same name as associated testing files
 */


_utils.Weaver.initializeSpace(['Collection', 'DataModel', 'Design', 'Page', 'PageContainer', 'Pattern', 'Route']);

_utils.Collector.initializeSpace();

global.bruteframework.configs = { // initialize dummy configs
	general: {
		pageStorePath: _path_.normalize(__dirname + "../../../Samples/TestPageDump/")
	}
};

var weaveProcesses = require('./Woven');
var helpersProcesses = require('./helpers');

var runner = new _BatchRunner2.default(_TestWrapper2.default, [true]); // [true] is to ensure test result reports are verbose

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
	for (var _iterator = weaveProcesses.concat(helpersProcesses)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
		var processItem = _step.value;

		runner.queue(processItem);
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

runner.run();