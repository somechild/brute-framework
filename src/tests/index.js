import BatchRunner from './BatchRunner';
import TestWrapper from './TestWrapper';


// this directory should mirror all other folders in parent directory and tests can be written for individual js files
// test files should have same name as associated testing files

const weaveProcesses = require('./Woven');
const helpersProcesses = require('./helpers');

const runner = new BatchRunner(TestWrapper, [true]); // [true] is to ensure test result reports are verbose

for (let processItem of weaveProcesses.concat(helpersProcesses)) {
	runner.queue(runner);
}

runner.run();