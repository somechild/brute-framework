'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Pattern = require('../../Woven/Pattern');

var _Pattern2 = _interopRequireDefault(_Pattern);

var _describe = require('../describe');

var _describe2 = _interopRequireDefault(_describe);

var _assertions = require('../assertions');

var _TestHelpers = require('../TestHelpers');

var _TestHelpers2 = _interopRequireDefault(_TestHelpers);

var _utils = require('../../helpers/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// create test
var PatternTest = (0, _describe2.default)({
	testName: 'Pattern class tests',
	testedFilePath: __dirname + '../../Woven/Pattern'
});

//aux


PatternTest.addTest(function () {
	var assert = new _assertions.Assertions();
	var errorCollector = new _assertions.ErrorCollector();
	assert.collectErrors(errorCollector);

	// constructor tests
	{}

	// get and set breakdown for patterns
	{}

	// stringify test
	{}

	// validate Pattern test 
	{}

	return errorCollector.finalize({ testedItemName: 'Pattern class' });
});

exports.default = PatternTest.finalize();