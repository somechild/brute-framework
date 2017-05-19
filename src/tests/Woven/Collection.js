import Collection from '../../Woven/Collection';
import describe from '../describe';

//aux
import { Assertions, ErrorCollector } from '../assertions';
import TestHelpers from '../TestHelpers';
import { Collector } from '../../helpers/utils';

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
		// check UsersTest setup correctly
		assert.equals('UsersTest', UsersTest.name, 'Constructor does not set the name correctly.');
		assert.equals('name', UsersTest.indexingProp, 'Constructor sets indexingProp incorrectly.');
		assert.truthy(UsersTest.entries instanceof Map, 'Constructor does not initialize entires map.');
		assert.truthy(UsersTest.id.length, 'Constructor does not initialize id.');
		assert.equals(UsersTest, Collector.getQuerier().with('UsersTest').getContext(), 'Constructor does not insert collection into global space using collector.');

		// schema fail
		assert.expectFailure(() => {
			let UsersBadSchema = new Collection("UsersTest2", {}, "foo");
		}, 'Collection constructor should validate schema.');
		
		// indexByProp fails
		assert.expectFailure(() => {
			let UsersBad = new Collection("UsersTest2", TestHelpers.getSampleSchema("UsersTest"));
		}, 'Missing indexByProp param for constructor should throw an error.');
		assert.expectFailure(() => {
			let UsersBad = new Collection("UsersTest2", TestHelpers.getSampleSchema("UsersTest"), "foo");
		}, 'If indexByProp param in constructor is not defined in schema, constructor should throw an error.');

		// name duplicate fail
		assert.expectFailure(() => {
			let UsersDupe = new Collection("UsersTest", TestHelpers.getSampleSchema("UsersTest"), "name");
		}, 'Collection constructor should not allow duplicate names');

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
