'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Route = require('../../Woven/Route');

var _Route2 = _interopRequireDefault(_Route);

var _assertions = require('../assertions.js');

var _Collection = require('../../Woven/Collection');

var _Collection2 = _interopRequireDefault(_Collection);

var _Design = require('../../Woven/Design');

var _Design2 = _interopRequireDefault(_Design);

var _TestHelpers = require('../TestHelpers.js');

var _TestHelpers2 = _interopRequireDefault(_TestHelpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//aux
var test = function test() {
	var UsersTest = new _Collection2.default("UsersTest", _TestHelpers2.default.getSampleSchema("UsersTest"), "name");
	var GeneralInfoTest = new _Collection2.default("GeneralInfoTest", _TestHelpers2.default.getSampleSchema("GeneralInfoTest"), "email");

	var sampleDesign = new _Design2.default(_TestHelpers2.default.getSampleDesign());

	var assert = new _assertions.Assertions();
	var collector = new _assertions.ErrorCollector();
	assert.collectErrors(collector);

	// constructor test

	var route = new _Route2.default(sampleDesign, {
		templatePath: __dirname + '/../../../Samples/SampleTemplate.html',
		name: "test"
	});

	// route name tests
	{
		assert.equals("test", route.name, "Constructor does not set name correctly.");

		var nameIsImmutabe = false;
		try {
			route.name = "restricted";
		} catch (e) {
			nameIsImmutabe = true;
		}
		assert.truthy(nameIsImmutabe, "name should not be mutable");
	}

	// id tests
	{
		assert.truthy(typeof route.id == "string" && route.id.length, "A unique ID has not been set automatically in the constructor");

		var idIsImmutabe = false;
		try {
			route.id = "restricted";
		} catch (e) {
			idIsImmutabe = true;
		}
		assert.truthy(idIsImmutabe, "id should not be mutable");
	}

	// weaver space existence tests
	{}

	// relationships with Model and PageContainer tests
	{}

	// template tests
	{}

	// get file with pattern test
	{}

	if (collector.errors.length > 0) {
		return {
			isSuccess: false,
			message: 'the Route class has experienced the following failures:' + collector.errors.join('\n') + '\n\n'
		};
	};
	return {
		isSuccess: true,
		message: null
	};
};

exports.default = [{
	name: 'Route tests',
	path: '../../Woven/Route',
	body: test
}];