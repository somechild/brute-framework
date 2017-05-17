'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ExpressionEvaluator = require('../../helpers/ExpressionEvaluator');

var _ExpressionEvaluator2 = _interopRequireDefault(_ExpressionEvaluator);

var _describe = require('../describe');

var _describe2 = _interopRequireDefault(_describe);

var _assertions = require('../assertions');

var _TestHelpers = require('../TestHelpers');

var _TestHelpers2 = _interopRequireDefault(_TestHelpers);

var _utils = require('../../helpers/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// create test group
var EvaluatorTest = (0, _describe2.default)({
	testName: 'ExpressionEvaluator and EntryWrapper class tests',
	testedFilePath: __dirname + '../../helpers/ExpressionEvaluator'
});

//aux


EvaluatorTest.addTest(function () {
	var assert = new _assertions.Assertions();
	var errorCollector = new _assertions.ErrorCollector();
	assert.collectErrors(errorCollector);

	// constructor tests
	{}

	// get and set value tests
	{}

	return errorCollector.finalize({ testedItemName: 'EntryWrapper class' });
});

EvaluatorTest.addTest(function () {
	var assert = new _assertions.Assertions();
	var errorCollector = new _assertions.ErrorCollector();
	assert.collectErrors(errorCollector);

	// --- public methods --- //

	// evaluate tests
	{}

	// --- private methods --- //

	// parseBrackets and parseShallowBrackets tests
	{}

	// simpleExpressionEval tests
	{}

	// compoundExpressionEvalLoop tests
	{}

	// collapseLogic helper tests
	{}

	return errorCollector.finalize({ testedItemName: 'ExpressionEvaluator class' });
});

exports.default = EvaluatorTest.finalize();