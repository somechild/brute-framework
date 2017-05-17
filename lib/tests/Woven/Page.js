'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Page = require('../../Woven/Page');

var _Page2 = _interopRequireDefault(_Page);

var _DataModel = require('../../Woven/DataModel');

var _DataModel2 = _interopRequireDefault(_DataModel);

var _Design = require('./Design');

var _Design2 = _interopRequireDefault(_Design);

var _Pattern = require('../../Woven/Pattern');

var _Pattern2 = _interopRequireDefault(_Pattern);

var _Route = require('./Route');

var _Route2 = _interopRequireDefault(_Route);

var _describe = require('../describe');

var _describe2 = _interopRequireDefault(_describe);

var _assertions = require('../assertions');

var _TestHelpers = require('../TestHelpers');

var _TestHelpers2 = _interopRequireDefault(_TestHelpers);

var _utils = require('../../helpers/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// create test
var PageTest = (0, _describe2.default)({
	testName: 'Page class tests',
	testedFilePath: __dirname + '../../Woven/Page'
});

//aux


PageTest.addTest(function () {
	var assert = new _assertions.Assertions();
	var errorCollector = new _assertions.ErrorCollector();
	assert.collectErrors(errorCollector);

	// constructor tests
	{}

	// recomputeData test
	{}

	// getFile test
	{}

	return errorCollector.finalize({ testedItemName: 'Page class' });
});

exports.default = PageTest.finalize();