/**
 * this directory should mirror all other folders in parent directory and tests can be written for individual js files
 * test files should have same name as associated testing files
 */
import BatchRunner from './BatchRunner';
import TestWrapper from './TestWrapper';


// create framework space in global scope
import { Collector, Weaver } from '../helpers/utils';
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

const weaveProcesses = require('./Woven');
const helpersProcesses = require('./helpers');

const runner = new BatchRunner(TestWrapper, [true]); // [true] is to ensure test result reports are verbose

for (let processItem of weaveProcesses.concat(helpersProcesses)) {
	runner.queue(processItem);
}

runner.run();