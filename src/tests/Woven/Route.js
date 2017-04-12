import Route from '../../Woven/Route';
import Design from '../../Woven/Design';

let test = function() {
	let sampleDesign = new Design(TestHelpers.getSampleDesign());
	let route = new Route(sampleDesign, {
		
	});



}


export default {
	name: 'Route tests',
	path: '../../Woven/Route',
	main: test,
}