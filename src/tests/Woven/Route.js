import Route from '../../Woven/Route';

//aux
import { Assertions, ErrorCollector } from '../assertions';
import Collection from '../../Woven/Collection';
import Design from '../../Woven/Design';
import Pattern from '../../Woven/Pattern';
import TestHelpers from '../TestHelpers';
import { Weaver } from '../../helpers/utils';

const _path_ = require('path');

const SampleTemplatePath = __dirname + '/../../../Samples/SampleTemplate.html';
const SampleTemplatePath_ALT = __dirname + '/../../../Samples/SampleTemplate_COPY.html'; //because many file-systems like linux's are case sensitive so tests for updating template path cannot simply change casing for updates
const SampleTemplatePath_INVALID = '^@  12131asdf~4.../asdf/.\/';
const SampleRouteName = "test";

let test = function() {
	let UsersTest = new Collection("UsersTest", TestHelpers.getSampleSchema("UsersTest"), "name");
	let GeneralInfoTest = new Collection("GeneralInfoTest", TestHelpers.getSampleSchema("GeneralInfoTest"), "email");

	let sampleDesign = new Design(TestHelpers.getSampleDesign());

	let assert = new Assertions();
	let collector = new ErrorCollector();
	assert.collectErrors(collector);

	// constructor test

	let route = new Route(sampleDesign, {
		templatePath: SampleTemplatePath,
		name: SampleRouteName,
	});

	// route name tests
	{
		assert.equals("test", route.name, "Constructor does not set name correctly.");

		let nameIsImmutabe = false;
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

		let idIsImmutabe = false;
		try {
			route.id = "restricted";
		} catch (e) {
			idIsImmutabe = true;
		}
		assert.truthy(idIsImmutabe, "id should not be mutable");
	}

	// weaver space existence tests
	{
		assert.truthy(Weaver.query('Route', route.id), "Constructor does not insert class into global class space.");
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

		let fakePathFailure = false;
		try {
			route.updateTemplate(SampleTemplatePath_INVALID);
		} catch(e) {
			fakePathFailure = true;
		}

		assert.truthy(fakePathFailure, `Updating route's template path to ${SampleTemplatePath_INVALID} should throw an error.`);

		route.updateTemplate(SampleTemplatePath_ALT);

		assert.equals(_path_.normalize(SampleTemplatePath_ALT), route.pageContainer.getTemplatePath(), 'Calling updateTemplate with a valid new template path does not update associated page countainer\'s template.');
	}

	// get file with pattern test
	{
		let patternFailure1 = false;
		try {
			route.getFileWithPattern({breakdown: TestHelpers.getSamplePattern()});
		} catch(e) {
			patternFailure1 = true;
		}
		assert.truthy(patternFailure1, 'getFileWithPattern method should validate for Pattern class');


		let TestPattern = new Pattern(TestHelpers.getSamplePattern());

		assert.falsey(route.getFileWithPattern(TestPattern), 'getFileWithPattern method does not return undefined when there is no data matching given pattern.');

		// TODO: more

	}

		
	if (collector.errors.length > 0) {
		return {
			isSuccess: false,
			message: 'the Route class has experienced the following failures: ' + collector.errors.join('\n') + '\n\n',
		}
	};
	return {
		isSuccess: true,
		message: null,
	}
}


export default [{
	name: 'Route tests',
	path: '../../Woven/Route',
	body: test,
}]