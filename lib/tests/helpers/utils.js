'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _utils = require('../../helpers/utils');

var utils = _interopRequireWildcard(_utils);

var _describe = require('../describe');

var _describe2 = _interopRequireDefault(_describe);

var _assertions = require('../assertions');

var _TestHelpers = require('../TestHelpers');

var _TestHelpers2 = _interopRequireDefault(_TestHelpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// create test group


//aux
var utilsTest = (0, _describe2.default)({
	testName: 'utils tests',
	testedFilePath: __dirname + '../../helpers/utils'
});

// --- classes --- //

// for Collector
utilsTest.addTest(function () {
	var assert = new _assertions.Assertions();
	var errorCollector = new _assertions.ErrorCollector();
	assert.collectErrors(errorCollector);

	// initializeSpace
	{}

	// clearSpace
	{}

	// addCollection
	{}

	// dropCollection
	{}

	// getQuerier
	{}

	return errorCollector.finalize({ testedItemName: 'Collector class' });
});

// for CollectionQuerier
utilsTest.addTest(function () {
	var assert = new _assertions.Assertions();
	var errorCollector = new _assertions.ErrorCollector();
	assert.collectErrors(errorCollector);

	// constructor
	{}

	// with
	{}

	// find
	{}

	// getContext
	{}

	return errorCollector.finalize({ testedItemName: 'CollectionQuerier class' });
});

// for TemplateProcessor
utilsTest.addTest(function () {
	var assert = new _assertions.Assertions();
	var errorCollector = new _assertions.ErrorCollector();
	assert.collectErrors(errorCollector);

	// constructor
	{}

	// setTemplate & validateTemplate
	{}

	// processWith
	{}

	return errorCollector.finalize({ testedItemName: 'TemplateProcessor class' });
});

// for Weaver
utilsTest.addTest(function () {
	var assert = new _assertions.Assertions();
	var errorCollector = new _assertions.ErrorCollector();
	assert.collectErrors(errorCollector);

	// initializeSpace
	{}

	// clearSpace
	{}

	// query
	{}

	// insert
	{}

	return errorCollector.finalize({ testedItemName: 'Weaver class' });
});

// --- methods --- //

utilsTest.addTest(function () {
	var assert = new _assertions.Assertions();
	var errorCollector = new _assertions.ErrorCollector();
	assert.collectErrors(errorCollector);

	// checkNotEmptyIfArray test
	{}

	// deepMatch test
	{}

	// easymerge test
	{}

	// emptyDir test
	{}

	// findByProp test
	{}

	// getConfigs test
	{}

	// getSafe test
	{}

	// parseResults test
	{}

	// println test
	{}

	// unwrap test
	{}

	return errorCollector.finalize({ testedItemName: 'utils methods' });
});

exports.default = utilsTest.finalize();