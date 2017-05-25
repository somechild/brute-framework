import DataModel from '../../Woven/DataModel';

import Collection from '../../Woven/Collection';
import Design from '../../Woven/Design';
import Route from '../../Woven/Route';
import Pattern from '../../Woven/Pattern';
import describe from '../describe';

//aux
import { Assertions, ErrorCollector } from '../assertions';
import TestHelpers from '../TestHelpers';
import { deepMatch, Weaver } from '../../helpers/utils';

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

		//reset
		dataModel.design = sampleDesign;
	}

	// update and get route
	{
		assert.expectFailure(() => {
			dataModel.route = route2;
		}, 'Pointing a DataModel\'s route to another route that doesn\'t already point back to the DataModel should throw an error. (Reflexive relationship must be started at the route pointer and completed at the DataModel pointer)');

		assert.equals(route, dataModel.route, 'Route getter on DataModel does not work correctly.');

		const route2OldModel = route2.model;
		route2.modelId = dataModel.id; // override
		dataModel.route = route2;

		assert.equals(route2, dataModel.route, 'Setting a new valid route does not work correctly.');

		//reset
		dataModel.route = route;
		route2.modelId = route2OldModel.id;
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
		
		let result;
		let expected;
		let typeCheck;
		let pattern = new Pattern({
			"user": "John^^Jane",
		});
		
		// test
		result = dataModel.getDataInstance(pattern);
		expected = ['John', 'Jane'];

		typeCheck = Array.isArray(result.userInfo);
		assert.truthy(typeCheck, 'getDataInstance does not return results of simple ^^ operator query correctly');
		if(typeCheck) {
			assert.equals(expected.length, result.userInfo.length, 'getDataInstance does not return results of simple ^^ operator query correctly');
			assert.truthy(
					result.userInfo.reduce( (accum, current) => { return accum && expected.indexOf(current.name) != -1; }, true ),
					'getDataInstance does not return results of simple ^^ operator query correctly'
				);
		};


		pattern = new Pattern({
			"user": "John&&Jane&&Joe",
		});

		// test
		result = dataModel.getDataInstance(pattern);
		expected = undefined;


		assert.equals(expected, result.userInfo, 'getDataInstance does not return results of chained && operator query correctly');

		pattern = new Pattern({
			"user": "Julia||Jake||Knob",
		});

		// test
		result = dataModel.getDataInstance(pattern);
		expected = 'Knob';

		typeCheck = typeof result.userInfo == 'object' && !Array.isArray(result.userInfo);
		assert.truthy(typeCheck, 'getDataInstance does not return results of chained || operator query correctly');
		if(typeCheck) {
			assert.equals(
					expected,
					result.userInfo.name,
					'getDataInstance does not return results of chained || operator query correctly'
				);
		};

		pattern = new Pattern({
			"user": "Jordan||{{Joe&&Rob}}^^Fob",
		});

		// test
		result = dataModel.getDataInstance(pattern);
		expected = ['Fob'];

		typeCheck = Array.isArray(result.userInfo);
		assert.truthy(typeCheck, 'getDataInstance does not return results of compound operator query correctly');
		if(typeCheck) {
			assert.equals(expected.length, result.userInfo.length, 'getDataInstance does not return results of compound operator query correctly');
			assert.truthy(
					result.userInfo.reduce( (accum, current) => { return accum && expected.indexOf(current.name) != -1; }, true ),
					'getDataInstance does not return results of compound operator query correctly'
				);
		};

		pattern = new Pattern({
			"user": "Jordan^^{{{{Joe||Rob}}^^{{Bob&&Jane}}}}",
		});

		// test
		result = dataModel.getDataInstance(pattern);
		expected = ['Rob', 'Bob', 'Jane'];

		typeCheck = Array.isArray(result.userInfo);
		assert.truthy(typeCheck, 'getDataInstance does not return results of compound nested operator query correctly');
		if(typeCheck) {
			assert.equals(expected.length, result.userInfo.length, 'getDataInstance does not return results of compound nested operator query correctly');
			assert.truthy(
					result.userInfo.reduce( (accum, current) => { return accum && expected.indexOf(current.name) != -1; }, true ),
					'getDataInstance does not return results of compound nested operator query correctly'
				);
		};

		GeneralInfoTest.insert(TestHelpers.getSampleCollectionEntry('GeneralInfoTest', 1));

		// test
		result = dataModel.getDataInstance(pattern);

	}


	return errorCollector.finalize({testedItemName: 'DataModel class'});
});

export default DataModelTest.finalize();