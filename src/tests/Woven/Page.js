import Page from '../../Woven/Page';
import DataModel from '../../Woven/DataModel';
import Design from './Design';
import Pattern from '../../Woven/Pattern';
import Route from './Route';
import describe from '../describe';

//aux
import { Assertions, ErrorCollector } from '../assertions';
import TestHelpers from '../TestHelpers';
import { Weaver } from '../../helpers/utils';

// create test
const PageTest = describe({
	testName: 'Page class tests', 
	testedFilePath: (__dirname + '../../Woven/Page'),
});

PageTest.addTest(function() {
	let assert = new Assertions();
	let errorCollector = new ErrorCollector();
	assert.collectErrors(errorCollector);



	// constructor tests
	{

	}

	// recomputeData test
	{

	}

	// getFile test
	{

	}

	return errorCollector.finalize({testedItemName: 'Page class'});
});

export default PageTest.finalize();