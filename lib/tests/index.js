'use strict';

var _BatchRunner = require('./BatchRunner');

var _BatchRunner2 = _interopRequireDefault(_BatchRunner);

var _TestWrapper = require('./TestWrapper');

var _TestWrapper2 = _interopRequireDefault(_TestWrapper);

var _utils = require('../helpers/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs'); /**
                         * this directory should mirror all other folders in parent directory and tests can be written for individual js files
                         * test files should have same name as associated testing files
                         */

var _path_ = require('path');

// get tests for 'Woven' and 'helpers' folders
var weaveProcesses = require('./Woven');
var helpersProcesses = require('./helpers');

global.bruteframework = { // initialize dummy configs
	configs: {
		general: {
			pageStorePath: _path_.normalize(__dirname + "../../../Samples/TestPageDump/")
		}
	}
};

// this will run tests
var runner = new _BatchRunner2.default(_TestWrapper2.default, [true]); // [true] is to ensure test result reports are verbose

// add tests to batch runner
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

runner.queueBeforeEach(function () {
	// initialize global space for framework to operate on
	_utils.Weaver.initializeSpace(['Collection', 'DataModel', 'Design', 'Page', 'PageContainer', 'Pattern', 'Route']);

	_utils.Collector.initializeSpace();
});

runner.queueAfterEach(function () {
	_utils.Weaver.clearSpace();
	_utils.Collector.clearSpace();
});

// run tests
runner.run();

// clean up file dump after tests complete

function emptyDir(dirPath) {
	// empty dir method
	fs.readdir(dirPath, function (err, files) {
		if (err) return console.log(err);
		if (!files.length) return;

		files.forEach(function (file) {
			var filePath = dirPath + file;
			fs.stat(filePath, function (err, stats) {
				if (err) return console.log(err);
				if (stats.isFile()) {
					fs.unlink(filePath, function (err) {
						if (err) console.log(err);
					});
				} else if (stats.isDirectory()) {
					emptyDir(filePath + '/');
				}
			});
		});
	});
};

// call emptyDir on page dump folder for tests
var pathToClear = global.bruteframework.configs.general.pageStorePath;
emptyDir(pathToClear);