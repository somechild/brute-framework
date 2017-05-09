/**
 * this method is poorly designed as it specifically tailors to TestWrapper
 * it's that bad part of OOP where you break up a big thing into smaller parts unecessarily complicating things imo
 * but i'm going to do this anyways for shits
 */

export default class BatchRunner {

	/**
	 * @param wrapper: class to wrap every queued process in
	 * @param wrapperArgs: Array - optional array of arguments to pass in addition to a process as the first arg when wrapping
	 */
	constructor(wrapper, wrapperArgs) {
		this.wrapper = wrapper;
		this.wrapperRunArgs = Array.isArray(wrapperArgs) ? wrapperArgs: [];
		this.processes = [];
		this.preProcesses = [];
		this.postProcesses = [];
	}

	/**
	 * queue process for execution
	 * NOTE: if 'wrapper' has been defined in the constructor - the process must return an object with an isSuccess boolean proeprty
	 * @param processItem: function || object -- method to queue. if to wrapper is defined, this should be an object with main, success and failed methods
	 */
	queue(processItem) {
		let toAdd = processItem;
		if (typeof this.wrapper != "undefined") {
			toAdd = new this.wrapper(toAdd, ...this.wrapperRunArgs);
		};
		this.processes.push(toAdd);
	}

	/**
	 * @param method: function - method to run after each process runs
	 * @throws Error if invalid param
	 */
	queueAfterEach(method) {
		if (typeof method != "function")
			throw new Error(`BatchRunner.queueAfterEach(): param ${method} should be a function.`);
		this.postProcesses.push(method);
	}

	/**
	 * @param method: function - method to run before each process runs
	 * @throws Error if invalid param
	 */
	queueBeforeEach(method) {
		if (typeof method != "function")
			throw new Error(`BatchRunner.queueBeforeEach(): param ${method} should be a function.`);
		this.preProcesses.push(method);
	}

	/**
	 * run the queued processes
	 */
	run() {
		if (typeof this.wrapper != "undefined") {
			for (let processItem of this.processes) {
				BatchRunner._runProcessList(this.preProcesses);
				const {isSuccess, message} = processItem.main();
				if (isSuccess) {
					processItem.success();
				} else {
					processItem.failed(message);
				};
				BatchRunner._runProcessList(this.postProcesses);
			}
		} else {
			for (let processItem of this.processes) {
				BatchRunner._runProcessList(this.preProcesses);
				processItem();
				BatchRunner._runProcessList(this.postProcesses);
			}
		};
	}

	/**
	 * NOTE: no validation for this as it's private
	 * @param list: [function] - list of functions to run
	 * @return Array: array of return values of each method (if method does not return anything, an 'undefined' placeholder will be pushed into array)
	 */
	static _runProcessList(processList) {
		let results = [];
		for (let method of processList) {
			results.push(method());
		}
		return results;
	}
}