import Collection from '../../Woven/Collection';
import describe from '../describe';

//aux
import { Assertions, ErrorCollector } from '../assertions';
import TestHelpers from '../TestHelpers';
import { Collector, deepMatch, unwrap } from '../../helpers/utils';

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
	let querier = Collector.getQuerier();

	// constructor tests
	{
		// check UsersTest setup correctly
		assert.equals('UsersTest', UsersTest.name, 'Constructor does not set the name correctly.');
		assert.equals('name', UsersTest.indexingProp, 'Constructor sets indexingProp incorrectly.');
		assert.truthy(UsersTest.entries instanceof Map, 'Constructor does not initialize entires map.');
		assert.truthy(UsersTest.id.length, 'Constructor does not initialize id.');
		assert.equals(UsersTest, querier.in('UsersTest').getContext(), 'Constructor does not insert collection into global space using collector.');

		// schema fail
		assert.expectFailure(() => {
			new Collection("Bad", {}, "foo");
		}, 'Collection constructor should validate schema.');
		
		// indexByProp fails
		assert.expectFailure(() => {
			new Collection("Bad", TestHelpers.getSampleSchema("UsersTest"));
		}, 'Missing indexByProp param for constructor should throw an error.');
		assert.expectFailure(() => {
			new Collection("Bad", TestHelpers.getSampleSchema("UsersTest"), "foo");
		}, 'If indexByProp param in constructor is not defined in schema, constructor should throw an error.');

		// name duplicate fail
		assert.expectFailure(() => {
			new Collection("UsersTest", TestHelpers.getSampleSchema("UsersTest"), "name");
		}, 'Collection constructor should not allow duplicate names');

	}


	//validate schema
	{
		// failures for passing the following in param:
			// non-object
			assert.falsey(Collection.validateSchema(1), 'Collection.validateSchema should not accept non-objects');
			// array
			assert.falsey(Collection.validateSchema([]), 'Collection.validateSchema should not accept arrays');
			// props of objects do not contain a definition object
			assert.falsey(Collection.validateSchema({"foo": []}), 'Collection.validateSchema must require keys to have values as field definitions');
			// 'type' field of a definition object is invalid
			assert.falsey(Collection.validateSchema({
				"foo": {
					type: "bar",
				},
			}), 'Collection.validateSchema should not allow property definitions to contain invalid property types.');
			// 'required' field of a definition object is defined, but not a boolean
			assert.falsey(Collection.validateSchema({
				"foo": {
					type: "string",
					required: "bar",
				},
			}), 'Collection.validateSchema should not allow property definitions to contain a non-boolean required prop.');
			// 'defaultValue' field of a definition object is not a valid type
			assert.falsey(Collection.validateSchema({
				"foo": {
					type: "string",
					defaultValue: 1,
				},
			}), 'Collection.validateSchema should not allow property definitions to contain an invalid defaultValue type.');
		// success for all else
		assert.truthy(Collection.validateSchema(TestHelpers.getSampleSchema()), 'Collection.validateSchema invalidates a valid schema.');
	}

	// insert & remove tests
	{
		// insert
			// invalid insertion (test for validateAgainstSchema method)
			assert.expectFailure(() => {
				UsersTest.insert([]);
			}, 'Insertion of non-objects should not be allowed');
			assert.expectFailure(() => {
				UsersTest.insert({
					"username": "foo",
				});
			}, 'Inserting objects missing required props should result in error');
			assert.expectFailure(() => {
				UsersTest.insert({
					"name": 5,
				});
			}, 'Inserting objects containing fields with invalid types should result in error');
			
			// unique key insertion
			assert.falsey(UsersTest.insert({
				"name": "John Doe",
			}), 'Inserting a new item with an indexing key that does not already exist in the collection should return undefined.');
			
			const JohnDoeRawQuery = querier.in('UsersTest').find({name: "John Doe"});
			const JohnDoeEntry = unwrap(JohnDoeRawQuery)[0];
			assert.equals('John Doe', JohnDoeEntry.name, 'Insert does not insert object correctly');
			
			// duplicate key insertion (should return old entry)
			assert.equals(JohnDoeEntry, UsersTest.insert({
				"name": "John Doe",
				"username": "foo",
			}), 'Inserting an object in a collection where another object with the same indexing key value already exists should return the old replaced object.');
			
			// default value existence check
			assert.equals(TestHelpers.getSampleSchema('UsersTest').profileImage.defaultValue, JohnDoeEntry.profileImage, 'Inserting an object with a field that hasn\'t been defined but has a defaultValue set in the schema should use the defaultValue.');

			UsersTest.insert({
				"name": "Jane Doe",
				"profileImage": "none",
			});

			const JaneDoeRawQuery = querier.in('UsersTest').find({name: "Jane Doe"});
			const JaneDoeEntry = unwrap(JaneDoeRawQuery)[0];
			assert.equals('none', JaneDoeEntry.profileImage, 'Defined value in a field should not be overriden with the defaultValue set in schema for said field.');

		// remove
			assert.expectFailure(() => {
				UsersTest.remove(() => 'foo');
			}, 'Invalid key for remove method should result in error.');
			// invalid remove returns undefined
			assert.falsey(UsersTest.remove('foo', 'bar').length, 'key/value pair with no matches in collection should result in empty list return in remove method.');

			// remove with unique indexing prop
			assert.equals(JaneDoeEntry, UsersTest.remove('name', 'Jane Doe')[0], 'Removing an entry should return the removed entry.');

			// remove with non-unique indexing prop (with multiple entry instances)
			UsersTest.insert({
				"name": "Jane Doe",
				"username": "foo",
			});
			UsersTest.insert({
				"name": "John Roe",
				"username": "foo",
			});
			UsersTest.insert({
				"name": "Jane Roe",
				"username": "foo",
			});
			const usernameAsfooRawQuery = querier.in('UsersTest').find({username: 'foo'});
			const usernameAsfooEntries = unwrap(usernameAsfooRawQuery);

			assert.truthy(deepMatch(
				usernameAsfooEntries.sort((a, b) => {
					return a.name - b.name;
				}), UsersTest.remove('username', 'foo').sort((a, b) => {
					return a.name - b.name;
				})
			), 'Removing with a key/value pair that matches multiple entries should return all matching entries');

			const usernamesAsfooEmptyEntries = unwrap( querier.in('UsersTest').find({username: 'foo'}) );
			assert.falsey( usernamesAsfooEmptyEntries.length , 'remove method does not remove all entries with matching key/value pair' );
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
