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
	var errorCollector = new _assertions.ErrorCollector();
	assert.collectErrors(errorCollector);

	var UsersTest = new _Collection2.default("UsersTest", _TestHelpers2.default.getSampleSchema("UsersTest"), "name");

	// constructor tests
	{}

	// schema fail

	// indexByProp fails

	// name duplicate fail

	//validate schema & object to insert against schema tests
	{}
	// failures for passing the following in param:
	// non-object
	// array
	// props of objects do not contain a definition object
	// 'type' field of a definition object is invalid
	// 'required' field of a definition object is defined, but not a boolean
	// 'defaultValue' field of a definition object is not a valid type
	// success for all else


	// insert & remove tests
	{}
	// insert
	// invalid insertion
	// unique key insertion
	// duplicate key insertion (should return old entry)
	// remove
	// invalid remove returns undefined
	// remove with unique indexing prop
	// remove with non-unique indexing prop (with multiple entry instances)


	// find query tests
	{
		// findOne (make queries with indexbyprops and also with other props)
		// success with one response
		// success with one response even though multiple entries exist
		// fail with undefined
		// find (make queries with indexbyprops and also with other props)
		// success with one response still wrapped in array
		// success with multi response
		// fail with undefined rather than empty array
		// findall
		// success with empty array
		// success with all responses
	}

	return errorCollector.finalize({ testedItemName: 'Collection class' });
});

exports.default = CollectionTest.finalize();