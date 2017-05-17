import DataModel from '../../Woven/DataModel';
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

DataModelTest.addTest(function() {
	let assert = new Assertions();
	let errorCollector = new ErrorCollector();
	assert.collectErrors(errorCollector);



	// constructor tests
	{

		
	}

	// update and get design
	{

	}

	// update and get route
	{

	}

	// getDataInstance tests
	{
		
	}


	return errorCollector.finalize({testedItemName: 'DataModel class'});
});

export default DataModelTest.finalize();