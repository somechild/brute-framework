/**
 * this directory should mirror all other folders in parent directory and tests can be written for individual js files
 * test files should have same name as associated testing files
 */
import BatchRunner from './BatchRunner';
import TestWrapper from './TestWrapper';


// create framework space in global scope
import { Collector, Weaver } from '../helpers/utils';

const fs = require('fs');
const _path_ = require('path');

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

const weaveProcesses = require('./Woven');
const helpersProcesses = require('./helpers');

const runner = new BatchRunner(TestWrapper, [true]); // [true] is to ensure test result reports are verbose

for (let processItem of weaveProcesses.concat(helpersProcesses)) {
	runner.queue(processItem);
}

runner.run();


// clean up file dump

function emptyDir(dirPath) { // empty dir method
	fs.readdir(dirPath, function(err, files) {
		if (err) return console.log(err);
		if (!files.length) return;

		files.forEach(function(file) {
			const filePath = dirPath + file;
			fs.stat(filePath, function(err, stats) {
				if (err) return console.log(err);
				if (stats.isFile()) {
					fs.unlink(filePath, function(err) {
						if (err) return console.log(err);
					});
				} else if (stats.isDirectory()) {
					emptyDir(filePath + '/');
				}
			});

		});
	});
};

//call
const pathToClear = global.bruteframework.configs.general.pageStorePath;
emptyDir(pathToClear);
