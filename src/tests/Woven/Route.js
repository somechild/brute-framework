import Route from '../../Woven/Route';
import describe from '../describe';

//aux
import { Assertions, ErrorCollector } from '../assertions';
import Collection from '../../Woven/Collection';
import Design from '../../Woven/Design';
import Pattern from '../../Woven/Pattern';
import TestHelpers from '../TestHelpers';
import { Weaver } from '../../helpers/utils';

const fs = require('fs');
const _path_ = require('path');

const SampleTemplatePath = __dirname + '/../../../Samples/SampleTemplate.html';
const SampleTemplatePath_ALT = __dirname + '/../../../Samples/SampleTemplate_COPY.html'; //because many file-systems like linux's are case sensitive so tests for updating template path cannot simply change casing for updates
const SampleTemplatePath_INVALID = '^@  12131asdf~4.../asdf/.\/';
const SampleRouteName = 'test';

// create test

const RouteTest = describe({
	testName: 'Route tests', 
	testedFilePath: (__dirname + '../../Woven/Route'),
});

RouteTest.addTest(function() {
	let assert = new Assertions();
	let errorCollector = new ErrorCollector();
	assert.collectErrors(errorCollector);

	let UsersTest = new Collection('UsersTest', TestHelpers.getSampleSchema('UsersTest'), 'name');
	let GeneralInfoTest = new Collection('GeneralInfoTest', TestHelpers.getSampleSchema('GeneralInfoTest'), 'key');

	let sampleDesign = new Design(TestHelpers.getSampleDesign());
	// constructor test

	let route = new Route(sampleDesign, {
		templatePath: SampleTemplatePath,
		name: SampleRouteName,
	});

	// route name tests
	{
		assert.equals('test', route.name, 'Constructor does not set name correctly.');

		assert.expectFailure(() => {
			route.name = 'restricted';
		}, 'name should not be mutable');
	}

	// id tests
	{
		assert.truthy(typeof route.id == 'string' && route.id.length, 'A unique ID has not been set automatically in the constructor');

		assert.expectFailure(() => {
			route.id = 'restricted';
		}, 'id should not be mutable');
	}

	// weaver space existence tests
	{
		assert.truthy(Weaver.query('Route', route.id), 'Constructor does not insert class into global class space.');
	}

	// relationships with Model and PageContainer tests
	{
		// model
		let routeModel = route.model;
		assert.equals(route, routeModel.route);

		// page container
		let routePageContainer = route.pageContainer;
		assert.equals(_path_.normalize(SampleTemplatePath), routePageContainer.getTemplatePath());
	}

	// template tests
	{
		let oldTemplatePath = route.pageContainer.getTemplatePath();
		route.updateTemplate();
		assert.equals(oldTemplatePath, route.pageContainer.getTemplatePath(), 'Calling updateTemplate without a parameter should not change template path - it is simply used for refresh purposes');

		assert.expectFailure(() => {
			route.updateTemplate(SampleTemplatePath_INVALID);
		}, `Updating route's template path to ${SampleTemplatePath_INVALID} should throw an error.`);

		route.updateTemplate(SampleTemplatePath_ALT);

		assert.equals(_path_.normalize(SampleTemplatePath_ALT), route.pageContainer.getTemplatePath(), 'Calling updateTemplate with a valid new template path does not update associated page countainer\'s template.');
	}

	// get file with pattern test
	{
		assert.expectFailure(() => {
			route.getFileWithPattern({breakdown: TestHelpers.getSamplePattern()});
		}, 'getFileWithPattern method should validate for Pattern class');


		let TestPattern = new Pattern(TestHelpers.getSamplePattern());

		assert.falsey(route.getFileWithPattern(TestPattern), 'getFileWithPattern method does not return undefined when there is no data matching given pattern.');
		
		UsersTest.insert(TestHelpers.getSampleCollectionEntry('UsersTest'));

		assert.truthy(fs.existsSync(route.getFileWithPattern(TestPattern)), 'getFileWithPattern does not return file path for partial model data existing in Collections');

		GeneralInfoTest.insert(TestHelpers.getSampleCollectionEntry('GeneralInfoTest', 1));
		GeneralInfoTest.insert(TestHelpers.getSampleCollectionEntry('GeneralInfoTest', 2));

		assert.truthy(fs.existsSync(route.getFileWithPattern(TestPattern)), 'getFileWithPattern does not return file path for all model data existing in Collections');

	}

	return errorCollector.finalize({testedItemName: 'Route class'});
});

export default RouteTest.finalize();
