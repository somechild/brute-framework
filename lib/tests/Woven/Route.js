'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Route = require('../../Woven/Route');

var _Route2 = _interopRequireDefault(_Route);

var _Collection = require('../../Woven/Collection');

var _Collection2 = _interopRequireDefault(_Collection);

var _Design = require('../../Woven/Design');

var _Design2 = _interopRequireDefault(_Design);

var _TestHelpers = require('../TestHelpers.js');

var _TestHelpers2 = _interopRequireDefault(_TestHelpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var test = function test() {
	var UsersTest = new _Collection2.default("UsersTest", _TestHelpers2.default.getSampleSchema("UsersTest"), "name");
	var GeneralInfoTest = new _Collection2.default("GeneralInfoTest", _TestHelpers2.default.getSampleSchema("GeneralInfoTest"), "email");

	var sampleDesign = new _Design2.default(_TestHelpers2.default.getSampleDesign());

	// constructor test

	var route = new _Route2.default(sampleDesign, {
		templatePath: __dirname + '/../../../Samples/SampleTemplate.html',
		name: "test"
	});

	return {
		isSuccess: true,
		result: null
	};
};

//aux
exports.default = [{
	name: 'Route tests',
	path: '../../Woven/Route',
	body: test
}];