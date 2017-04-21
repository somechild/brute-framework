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
	 * run the queued processes
	 * TODO: use async threads
	 */
	run() {
		if (typeof this.wrapper != "undefined") {
			for (let processItem of this.processes) {
				const {isSuccess, result} = processItem.main();
				if (isSuccess) {
					processItem.success();
				} else {
					processItem.failed(result);
				};
			}
		} else {
			for (let processItem of this.processes) {
				processItem();
			}
		};
	}
}