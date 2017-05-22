import DataModel from '../../Woven/DataModel';

import Collection from '../../Woven/Collection';
import Design from '../../Woven/Design';
import Route from '../../Woven/Route';
import Pattern from '../../Woven/Pattern';
import describe from '../describe';

//aux
import { Assertions, ErrorCollector } from '../assertions';
import TestHelpers from '../TestHelpers';
import { Weaver } from '../../helpers/utils';

// create test
const DataModelTest = describe({
	testName: 'DataModel class tests', 
	testedFilePath: (__dirname + '../../Woven/DataModel'),
});

const SampleTemplatePath = __dirname + '/../../../Samples/SampleTemplate.html';
const SampleRouteName = 'test';
const SampleRouteName2 = 'test2';

DataModelTest.addTest(function() {
	let assert = new Assertions();
	let errorCollector = new ErrorCollector();
	assert.collectErrors(errorCollector);

	let UsersTest = new Collection('UsersTest', TestHelpers.getSampleSchema('UsersTest'), 'name');
	let GeneralInfoTest = new Collection('GeneralInfoTest', TestHelpers.getSampleSchema('GeneralInfoTest'), 'key');

	const sampleDesign = new Design(TestHelpers.getSampleDesign());
	const sampleDesign2 = new Design(TestHelpers.getSampleDesign(true));

	let route = new Route(sampleDesign, {
		templatePath: SampleTemplatePath,
		name: SampleRouteName,
	}); // this should trigger data model constructor

	let route2 = new Route(sampleDesign, {
		templatePath: SampleTemplatePath,
		name: SampleRouteName2,
	}); // this should trigger data model constructor

	let dataModel = route.model;

	// constructor tests/checks
	{

		assert.truthy(dataModel instanceof DataModel, 'Route constructor does not create a data model instance to track.');
		assert.equals(route, dataModel.route, 'DataModel\'s constructor incorrectly sets route instance associations.');

		assert.expectFailure(() => {
			new DataModel({}, {});
		}, 'Constructor should check for valid design param');
		
		assert.expectFailure(() => {
			new DataModel(sampleDesign, {});
		}, 'Constructor should check for valid route param');
	}

	// update and get design
	{

		assert.expectFailure(() => {
			dataModel.design = {};
		}, 'Design setter should validate design');

		assert.equals(sampleDesign, dataModel.design, 'Design getter does not work correctly.');
		dataModel.design = sampleDesign2;
		assert.equals(sampleDesign2, dataModel.design, 'Design setter does not work correctly.');

	}

	// update and get route
	{
		assert.expectFailure(() => {
			dataModel.route = route2;
		}, 'Pointing a DataModel\'s route to another route that doesn\'t already point back to the DataModel should throw an error. (Reflexive relationship must be started at the route pointer and completed at the DataModel pointer)');

		assert.equals(route, dataModel.route, 'Route getter on DataModel does not work correctly.');

		route2.modelId = dataModel.id; // override
		dataModel.route = route2;

		assert.equals(route2, dataModel.route, 'Setting a new valid route does not work correctly.');

	}

	// getDataInstance tests
	{
		UsersTest.insert({
			"name": "John",
		});
		UsersTest.insert({
			"name": "Jane",
		});
		UsersTest.insert({
			"name": "Bob",
		});
		UsersTest.insert({
			"name": "Rob",
		});
		UsersTest.insert({
			"name": "Knob",
		});
		UsersTest.insert({
			"name": "Fob",
		});
		
		let pattern = new Pattern({
			"userInfo": "John^^Jane",
		});

		// test

		pattern = new Pattern({
			"userInfo": "John&&Jane&&Joe",
		});

		// test

		pattern = new Pattern({
			"userInfo": "Julia||Jake",
		});

		// test

		pattern = new Pattern({
			"userInfo": "Jordan||(Joe&&Rob)",
		});

		// test

		pattern = new Pattern({
			"userInfo": "Jordan^^(Joe||Rob)^^Bob",
		});

		// test

		GeneralInfoTest.insert(TestHelpers.getSampleCollectionEntry('GeneralInfoTest', 1));

		// test


	}


	return errorCollector.finalize({testedItemName: 'DataModel class'});
});

export default DataModelTest.finalize();