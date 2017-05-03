import Route from '../../Woven/Route';

//aux
import Collection from '../../Woven/Collection';
import Design from '../../Woven/Design';
import TestHelpers from '../TestHelpers.js';

let assert = new TestHelpers.Assertions();

let test = function() {
	let UsersTest = new Collection("UsersTest", TestHelpers.getSampleSchema("UsersTest"), "name");
	let GeneralInfoTest = new Collection("GeneralInfoTest", TestHelpers.getSampleSchema("GeneralInfoTest"), "email");

	let sampleDesign = new Design(TestHelpers.getSampleDesign());

	// constructor test

	let route = new Route(sampleDesign, {
		templatePath: (__dirname + '/../../../Samples/SampleTemplate.html'),
		name: "test",
	});


	
	
	return {
		isSuccess: true,
		result: null,
	}
}


export default [{
	name: 'Route tests',
	path: '../../Woven/Route',
	body: test,
}]