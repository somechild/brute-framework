import { deepMatch } from '../helpers/utils';

export class Assertions {
	/**
	 * public methods for assertions
	 * @throws Error if failure & 'enableErrorThrows' has been called
	 * @return void if success
	 * @return String if failure
	 */

	equals(expected, result, message, weakEquality) {
		if ((!weakEquality && expected === result) || (weakEquality && expected == result)) {
			return;
		} else if(weakEquality && typeof expected == "object" && typeof result == "object" && deepMatch(expected, result)) {
			return;
		} else {
			return _handleFailure(message || `${expected} does not equal ${result}`);
		};
	}

	truthy(result, message) {
		if (result == true) {
			return;
		} else {
			return _handleFailure(message || `${result} is not truthy`);
		};
	}

	falsey(result, message) {
		if (result == false) {
			return;
		} else {
			return _handleFailure(message || `${result} is not truthy`);
		};
	}

	/**
	 * call to have failures result in errors being thrown
	 * overrides collectErrors
	 */
	enableErrorThrows() {
		this.toThrow = true;
	}

	/**
	 * collect all errors within collector
	 * @param collector - a new collector of type ErrorCollector
	 * @throws Error if collector is not of type ErrorCollector
	 */
	collectErrors(collector) {
		if (! (collector instanceof ErrorCollector) )
			throw new Error(`${collector} is not of class type ErrorCollector`);
		this.toCollect = true;
		this.collector = collector;
	}

	/** 
	 * depending on enable error throws being called or not, throw error or return message
	 */
	_handleFailure(message) {
		if (this.toThrow) {
			throw new Error(message);
		} else if(this.toCollect) {
			this.collector.add(message);
		} else {
			return message;
		};
	}
}

export class ErrorCollector {
	constructor() {

	}

	/**
	 * @param message: String - error message to add
	 */
	add(message) {

	}

	/**
	 * @return [String]
	 */
	get errors() {

	}

	/**
	 * @param formatted: Boolean - true if color format printed errors
	 */
	printErrors(formatted) {

	}
}