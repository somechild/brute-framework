'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _PageContainer = require('../../Woven/PageContainer');

var _PageContainer2 = _interopRequireDefault(_PageContainer);

var _Page = require('../../Woven/Page');

var _Page2 = _interopRequireDefault(_Page);

var _describe = require('../describe');

var _describe2 = _interopRequireDefault(_describe);

var _assertions = require('../assertions');

var _TestHelpers = require('../TestHelpers');

var _TestHelpers2 = _interopRequireDefault(_TestHelpers);

var _utils = require('../../helpers/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// create test
var PageContainerTest = (0, _describe2.default)({
	testName: 'PageContainer class tests',
	testedFilePath: __dirname + '../../Woven/PageContainer'
});

//aux


PageContainerTest.addTest(function () {
	var assert = new _assertions.Assertions();
	var errorCollector = new _assertions.ErrorCollector();
	assert.collectErrors(errorCollector);

	// constructor tests
	{}

	// getPage, getPageWithData and createPage tests
	{}

	return errorCollector.finalize({ testedItemName: 'PageContainer class' });
});

exports.default = PageContainerTest.finalize();