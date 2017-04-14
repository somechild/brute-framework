import Route from '../../Woven/Route';
import Design from '../../Woven/Design';

let test = function() {
	let UsersTest = new Collection("UsersTest", TestHelpers.getSampleSchema("UsersTest"), "name");
	let GeneralInfoTest = new Collection("GeneralInfoTest", TestHelpers.getSampleSchema("GeneralInfoTest"), "email");

	let sampleDesign = new Design(TestHelpers.getSampleDesign());
	let route = new Route(sampleDesign, {
		templatePath: (__dirname + '/../SampleTemplate.html'),
		name: "test",
	});



}


export default [{
	name: 'Route tests',
	path: '../../Woven/Route',
	main: test,
}]