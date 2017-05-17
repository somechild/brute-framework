import EntryWrapper from '../../helpers/ExpressionEvaluator';
import ExpressionEvaluator from '../../helpers/ExpressionEvaluator';
import describe from '../describe';

//aux
import { Assertions, ErrorCollector } from '../assertions';
import TestHelpers from '../TestHelpers';
import { Weaver } from '../../helpers/utils';

// create test group
const EvaluatorTest = describe({
	testName: 'ExpressionEvaluator and EntryWrapper class tests', 
	testedFilePath: (__dirname + '../../helpers/ExpressionEvaluator'),
});

EvaluatorTest.addTest(function() {
	let assert = new Assertions();
	let errorCollector = new ErrorCollector();
	assert.collectErrors(errorCollector);

	// constructor tests
	{

	}

	// get and set value tests
	{

	}

	return errorCollector.finalize({testedItemName: 'EntryWrapper class'});
});

EvaluatorTest.addTest(function() {
	let assert = new Assertions();
	let errorCollector = new ErrorCollector();
	assert.collectErrors(errorCollector);

	// --- public methods --- //

	// evaluate tests
	{

	}

	// --- private methods --- //

	// parseBrackets and parseShallowBrackets tests
	{

	}

	// simpleExpressionEval tests
	{

	}

	// compoundExpressionEvalLoop tests
	{

	}

	// collapseLogic helper tests
	{
		
	}

	return errorCollector.finalize({testedItemName: 'ExpressionEvaluator class'});
});

export default EvaluatorTest.finalize();
