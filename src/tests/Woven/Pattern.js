import Pattern from '../../Woven/Pattern';
import describe from '../describe';

//aux
import { Assertions, ErrorCollector } from '../assertions';
import TestHelpers from '../TestHelpers';
import { Weaver } from '../../helpers/utils';

// create test
const PatternTest = describe({
	testName: 'Pattern class tests', 
	testedFilePath: (__dirname + '../../Woven/Pattern'),
});

PatternTest.addTest(function() {
	let assert = new Assertions();
	let errorCollector = new ErrorCollector();
	assert.collectErrors(errorCollector);



	// constructor tests
	{

	}

	// get and set breakdown for patterns
	{

	}

	// stringify test
	{

	}

	// validate Pattern test 
	{

	}

	return errorCollector.finalize({testedItemName: 'Pattern class'});
});

export default PatternTest.finalize();