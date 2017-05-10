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
	let errorCollector = new ErrorCollector();
	assert.collectErrors(errorCollector);

	let UsersTest = new Collection("UsersTest", TestHelpers.getSampleSchema("UsersTest"), "name");

	// constructor tests
	{
		
		// schema fail
		
		// indexByProp fails
		
		// name duplicate fail
		
	}


	//validate schema & object to insert against schema tests
	{
		// failures for passing the following in param:
			// non-object
			// array
			// props of objects do not contain a definition object
			// 'type' field of a definition object is invalid
			// 'required' field of a definition object is defined, but not a boolean
			// 'defaultValue' field of a definition object is not a valid type
		// success for all else
	}

	// insert & remove tests
	{
		// insert
			// invalid insertion
			// unique key insertion
			// duplicate key insertion (should return old entry)
		// remove
			// invalid remove returns undefined
			// remove with unique indexing prop
			// remove with non-unique indexing prop (with multiple entry instances)
	}

	// find query tests
	{
		// findOne (make queries with indexbyprops and also with other props)
			// success with one response
			// success with one response even though multiple entries exist
			// fail with undefined
		// find (make queries with indexbyprops and also with other props)
			// success with one response still wrapped in array
			// success with multi response
			// fail with undefined rather than empty array
		// findall
			// success with empty array
			// success with all responses
	}




	return errorCollector.finalize({testedItemName: 'Collection class'});
});

export default CollectionTest.finalize();
