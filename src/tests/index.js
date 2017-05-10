/**
 * this directory should mirror all other folders in parent directory and tests can be written for individual js files
 * test files should have same name as associated testing files
 */
import BatchRunner from './BatchRunner';
import TestWrapper from './TestWrapper';
import { Collector, Weaver, emptyDir } from '../helpers/utils';

const _path_ = require('path');

// get tests for 'Woven' and 'helpers' folders
const weaveProcesses = require('./Woven');
const helpersProcesses = require('./helpers');

global.bruteframework = { // initialize dummy configs
	configs: {
		general: {
			pageStorePath: _path_.normalize(__dirname + "../../../Samples/TestPageDump/"),
		},
	},
};

// this will run tests
const runner = new BatchRunner(TestWrapper, [true]); // [true] is to ensure test result reports are verbose

// add tests to batch runner
for (let processItem of weaveProcesses.concat(helpersProcesses)) {
	runner.queue(processItem);
}

runner.queueBeforeEach(() => {
	// initialize global space for framework to operate on
	Weaver.initializeSpace([
		'Collection',
		'DataModel',
		'Design',
		'Page',
		'PageContainer',
		'Pattern',
		'Route'
	]);

	Collector.initializeSpace();
});

runner.queueAfterEach(() => {
	Weaver.clearSpace();
	Collector.clearSpace();
});

// run tests
runner.run();


// clean up file dump after tests complete
const pathToClear = global.bruteframework.configs.general.pageStorePath;
emptyDir(pathToClear);
