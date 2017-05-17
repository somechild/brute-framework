import * as utils from '../../helpers/utils';
import describe from '../describe';

//aux
import { Assertions, ErrorCollector } from '../assertions';
import TestHelpers from '../TestHelpers';

// create test group
const utilsTest = describe({
	testName: 'utils tests', 
	testedFilePath: (__dirname + '../../helpers/utils'),
});


// --- classes --- //

// for Collector
utilsTest.addTest(function() {
	let assert = new Assertions();
	let errorCollector = new ErrorCollector();
	assert.collectErrors(errorCollector);

	// initializeSpace
	{

	}
	
	// clearSpace
	{

	}
	
	// addCollection
	{

	}
	
	// dropCollection
	{

	}

	// getQuerier
	{

	}

	return errorCollector.finalize({testedItemName: 'Collector class'});
});

// for CollectionQuerier
utilsTest.addTest(function() {
	let assert = new Assertions();
	let errorCollector = new ErrorCollector();
	assert.collectErrors(errorCollector);

	// constructor
	{

	}

	// with
	{

	}

	// find
	{

	}

	// getContext
	{

	}

	return errorCollector.finalize({testedItemName: 'CollectionQuerier class'});
});

// for TemplateProcessor
utilsTest.addTest(function() {
	let assert = new Assertions();
	let errorCollector = new ErrorCollector();
	assert.collectErrors(errorCollector);

	// constructor
	{

	}

	// setTemplate & validateTemplate
	{

	}

	// processWith
	{

	}

	return errorCollector.finalize({testedItemName: 'TemplateProcessor class'});
});

// for Weaver
utilsTest.addTest(function() {
	let assert = new Assertions();
	let errorCollector = new ErrorCollector();
	assert.collectErrors(errorCollector);

	// initializeSpace
	{

	}

	// clearSpace
	{

	}

	// query
	{

	}

	// insert
	{

	}

	return errorCollector.finalize({testedItemName: 'Weaver class'});
});

// --- methods --- //

utilsTest.addTest(function() {
	let assert = new Assertions();
	let errorCollector = new ErrorCollector();
	assert.collectErrors(errorCollector);

	// checkNotEmptyIfArray test
	{

	}

	// deepMatch test
	{

	}

	// easymerge test
	{

	}

	// emptyDir test
	{

	}

	// findByProp test
	{

	}

	// getConfigs test
	{

	}

	// getSafe test
	{

	}

	// parseResults test
	{

	}

	// println test
	{

	}

	// unwrap test
	{

	}

	return errorCollector.finalize({testedItemName: 'utils methods'});
});



export default utilsTest.finalize();