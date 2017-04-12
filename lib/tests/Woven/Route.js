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
	var sampleDesign = new _Design2.default(TestHelpers.getSampleDesign());
	var route = new _Route2.default(sampleDesign, {});
};

exports.default = {
	name: 'Route tests',
	path: '../../Woven/Route',
	main: test
};