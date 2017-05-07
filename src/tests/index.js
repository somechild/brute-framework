/**
 * this directory should mirror all other folders in parent directory and tests can be written for individual js files
 * test files should have same name as associated testing files
 */
import BatchRunner from './BatchRunner';
import TestWrapper from './TestWrapper';
import { Collector, Weaver } from '../helpers/utils';

const fs = require('fs');
const _path_ = require('path');


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

global.bruteframework.configs = { // initialize dummy configs
	general: {
		pageStorePath: _path_.normalize(__dirname + "../../../Samples/TestPageDump/"),
	},
};

// get tests for 'Woven' and 'helpers' folders
const weaveProcesses = require('./Woven');
const helpersProcesses = require('./helpers');

// this will run tests
const runner = new BatchRunner(TestWrapper, [true]); // [true] is to ensure test result reports are verbose

// add tests to batch runner
for (let processItem of weaveProcesses.concat(helpersProcesses)) {
	runner.queue(processItem);
}

// run tests
runner.run();


// clean up file dump after tests complete

function emptyDir(dirPath) { // empty dir method
	fs.readdir(dirPath, (err, files) => {
		if (err) return console.log(err);
		if (!files.length) return;

		files.forEach((file) => {
			const filePath = dirPath + file;
			fs.stat(filePath, (err, stats) => {
				if (err) return console.log(err);
				if (stats.isFile()) {
					fs.unlink(filePath, (err) => { if(err) console.log(err); });
				} else if (stats.isDirectory()) {
					emptyDir(filePath + '/');
				}
			});

		});
	});
};

// call emptyDir on page dump folder for tests
const pathToClear = global.bruteframework.configs.general.pageStorePath;
emptyDir(pathToClear);
