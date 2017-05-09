'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Route = require('../../Woven/Route');

var _Route2 = _interopRequireDefault(_Route);

var _describe = require('../describe');

var _describe2 = _interopRequireDefault(_describe);

var _assertions = require('../assertions');

var _Collection = require('../../Woven/Collection');

var _Collection2 = _interopRequireDefault(_Collection);

var _Design = require('../../Woven/Design');

var _Design2 = _interopRequireDefault(_Design);

var _Pattern = require('../../Woven/Pattern');

var _Pattern2 = _interopRequireDefault(_Pattern);

var _TestHelpers = require('../TestHelpers');

var _TestHelpers2 = _interopRequireDefault(_TestHelpers);

var _utils = require('../../helpers/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//aux
var fs = require('fs');
var _path_ = require('path');

var SampleTemplatePath = __dirname + '/../../../Samples/SampleTemplate.html';
var SampleTemplatePath_ALT = __dirname + '/../../../Samples/SampleTemplate_COPY.html'; //because many file-systems like linux's are case sensitive so tests for updating template path cannot simply change casing for updates
var SampleTemplatePath_INVALID = '^@  12131asdf~4.../asdf/.\/';
var SampleRouteName = 'test';

// create test

var RouteTest = (0, _describe2.default)({
	testName: 'Route tests',
	testedFilePath: __dirname + '../../Woven/Route'
});

RouteTest.addTest(function () {
	var UsersTest = new _Collection2.default('UsersTest', _TestHelpers2.default.getSampleSchema('UsersTest'), 'name');
	var GeneralInfoTest = new _Collection2.default('GeneralInfoTest', _TestHelpers2.default.getSampleSchema('GeneralInfoTest'), 'key');

	var sampleDesign = new _Design2.default(_TestHelpers2.default.getSampleDesign());

	var assert = new _assertions.Assertions();
	var collector = new _assertions.ErrorCollector();
	assert.collectErrors(collector);

	// constructor test

	var route = new _Route2.default(sampleDesign, {
		templatePath: SampleTemplatePath,
		name: SampleRouteName
	});

	// route name tests
	{
		assert.equals('test', route.name, 'Constructor does not set name correctly.');

		assert.expectFailure(function () {
			route.name = 'restricted';
		}, 'name should not be mutable');
	}

	// id tests
	{
		assert.truthy(typeof route.id == 'string' && route.id.length, 'A unique ID has not been set automatically in the constructor');

		assert.expectFailure(function () {
			route.id = 'restricted';
		}, 'id should not be mutable');
	}

	// weaver space existence tests
	{
		assert.truthy(_utils.Weaver.query('Route', route.id), 'Constructor does not insert class into global class space.');
	}

	// relationships with Model and PageContainer tests
	{
		// model
		var routeModel = route.model;
		assert.equals(route, routeModel.route);

		// page container
		var routePageContainer = route.pageContainer;
		assert.equals(_path_.normalize(SampleTemplatePath), routePageContainer.getTemplatePath());
	}

	// template tests
	{
		var oldTemplatePath = route.pageContainer.getTemplatePath();
		route.updateTemplate();
		assert.equals(oldTemplatePath, route.pageContainer.getTemplatePath(), 'Calling updateTemplate without a parameter should not change template path - it is simply used for refresh purposes');

		assert.expectFailure(function () {
			route.updateTemplate(SampleTemplatePath_INVALID);
		}, `Updating route's template path to ${SampleTemplatePath_INVALID} should throw an error.`);

		route.updateTemplate(SampleTemplatePath_ALT);

		assert.equals(_path_.normalize(SampleTemplatePath_ALT), route.pageContainer.getTemplatePath(), 'Calling updateTemplate with a valid new template path does not update associated page countainer\'s template.');
	}

	// get file with pattern test
	{
		assert.expectFailure(function () {
			route.getFileWithPattern({ breakdown: _TestHelpers2.default.getSamplePattern() });
		}, 'getFileWithPattern method should validate for Pattern class');

		var TestPattern = new _Pattern2.default(_TestHelpers2.default.getSamplePattern());

		assert.falsey(route.getFileWithPattern(TestPattern), 'getFileWithPattern method does not return undefined when there is no data matching given pattern.');

		UsersTest.insert(_TestHelpers2.default.getSampleCollectionEntry('UsersTest'));

		assert.truthy(fs.existsSync(route.getFileWithPattern(TestPattern)), 'getFileWithPattern does not return file path for partial model data existing in Collections');

		GeneralInfoTest.insert(_TestHelpers2.default.getSampleCollectionEntry('GeneralInfoTest', 1));
		GeneralInfoTest.insert(_TestHelpers2.default.getSampleCollectionEntry('GeneralInfoTest', 2));

		assert.truthy(fs.existsSync(route.getFileWithPattern(TestPattern)), 'getFileWithPattern does not return file path for all model data existing in Collections');
	}

	return collector.finalize({ testedItemName: 'Route class' });
});

exports.default = RouteTest.finalize();