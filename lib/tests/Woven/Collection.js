'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Collection = require('../../Woven/Collection');

var _Collection2 = _interopRequireDefault(_Collection);

var _describe = require('../describe');

var _describe2 = _interopRequireDefault(_describe);

var _assertions = require('../assertions');

var _TestHelpers = require('../TestHelpers');

var _TestHelpers2 = _interopRequireDefault(_TestHelpers);

var _utils = require('../../helpers/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// create test
var CollectionTest = (0, _describe2.default)({
	testName: 'Collection class tests',
	testedFilePath: __dirname + '../../Woven/Collection'
});

//aux


CollectionTest.addTest(function () {
	var assert = new _assertions.Assertions();
	var collector = new _assertions.ErrorCollector();
	assert.collectErrors(collector);

	var UsersTest = new _Collection2.default("UsersTest", _TestHelpers2.default.getSampleSchema("UsersTest"), "name");

	// constructor tests
	{}

	// schema fail

	// indexByProp fails

	// name duplicate fail

	//validate schema & object to insert against schema tests
	{}

	// insert & remove tests
	{}

	// find query tests
	{}

	return collector.finalize({ testedItemName: 'Collection class' });
});

exports.default = CollectionTest.finalize();