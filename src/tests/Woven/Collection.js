import Collection from '../../Woven/Collection';
import describe from '../describe';

//aux
import { Assertions, ErrorCollector } from '../assertions';
import TestHelpers from '../TestHelpers';
import { Weaver } from '../../helpers/utils';

// create test
const CollectionTest = describe({
	testName: 'Collection class tests', 
	testedFilePath: (__dirname + '../../Woven/Collection'),
});

CollectionTest.addTest(function() {
	let assert = new Assertions();
	let collector = new ErrorCollector();
	assert.collectErrors(collector);

	let UsersTest = new Collection("UsersTest", TestHelpers.getSampleSchema("UsersTest"), "name");

	// constructor tests
	{
		
		// schema fail
		
		// indexByProp fails
		
		// name duplicate fail

	}


	//validate schema & object to insert against schema tests
	{
		
	}

	// insert & remove tests
	{

	}

	// find query tests
	{

	}




	return collector.finalize({testedItemName: 'Collection class'});
});

export default CollectionTest.finalize();
