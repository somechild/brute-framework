'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Route = require('../../Woven/Route');

var _Route2 = _interopRequireDefault(_Route);

var _Design = require('../../Woven/Design');

var _Design2 = _interopRequireDefault(_Design);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var test = function test() {
	var UsersTest = new Collection("UsersTest", TestHelpers.getSampleSchema("UsersTest"), "name");
	var GeneralInfoTest = new Collection("GeneralInfoTest", TestHelpers.getSampleSchema("GeneralInfoTest"), "email");

	var sampleDesign = new _Design2.default(TestHelpers.getSampleDesign());
	var route = new _Route2.default(sampleDesign, {
		templatePath: __dirname + '/../SampleTemplate.html',
		name: "test"
	});
};

exports.default = [{
	name: 'Route tests',
	path: '../../Woven/Route',
	main: test
}];