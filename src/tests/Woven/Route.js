import Route from '../../Woven/Route';

//aux
import { Assertions, ErrorCollector } from '../assertions.js';
import Collection from '../../Woven/Collection';
import Design from '../../Woven/Design';
import TestHelpers from '../TestHelpers.js';

let test = function() {
	let UsersTest = new Collection("UsersTest", TestHelpers.getSampleSchema("UsersTest"), "name");
	let GeneralInfoTest = new Collection("GeneralInfoTest", TestHelpers.getSampleSchema("GeneralInfoTest"), "email");

	let sampleDesign = new Design(TestHelpers.getSampleDesign());

	let assert = new Assertions();
	let collector = new ErrorCollector();
	assert.collectErrors(collector);

	// constructor test

	let route = new Route(sampleDesign, {
		templatePath: (__dirname + '/../../../Samples/SampleTemplate.html'),
		name: "test",
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

	}

	// relationships with Model and PageContainer tests
	{

	}

	// template tests
	{

	}

	// get file with pattern test
	{

	}

		
	if (collector.errors.length > 0) {
		return {
			isSuccess: false,
			message: 'the Route class has experienced the following failures:' + collector.errors.join('\n') + '\n\n',
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