import Design from '../../Woven/Design';
import describe from '../describe';

//aux
import { Assertions, ErrorCollector } from '../assertions';
import TestHelpers from '../TestHelpers';
import { Weaver } from '../../helpers/utils';

// create test
const DesignTest = describe({
	testName: 'Design class tests', 
	testedFilePath: (__dirname + '../../Woven/Design'),
});

DesignTest.addTest(function() {
	let assert = new Assertions();
	let errorCollector = new ErrorCollector();
	assert.collectErrors(errorCollector);



	// constructor tests
	{

	}

	// update and get layout
	{

	}

	// validate Design
	{

	}


	return errorCollector.finalize({testedItemName: 'Design class'});
});

export default DesignTest.finalize();