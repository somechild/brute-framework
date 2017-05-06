import { deepMatch } from '../helpers/utils';

export class Assertions {
	/**
	 * public methods for assertions
	 * @throws Error if failure & 'enableErrorThrows' has been called
	 * @return void if success
	 * @return String if failure
	 */

	/**
	 * @param weakEquality: true if expected and result should be compared with two equal signs OR if they are objects, to compare them with a deep match
	 */
	equals(expected, result, message, weakEquality) {
		if ((!weakEquality && expected === result) || (weakEquality && expected == result)) {
			return;
		} else if(weakEquality && typeof expected == "object" && typeof result == "object" && deepMatch(expected, result)) {
			return;
		} else {
			return this._handleFailure(message || `${expected} does not equal ${result}`);
		};
	}

	truthy(result, message) {
		if (result) {
			return;
		} else {
			return this._handleFailure(message || `${result} is not truthy`);
		};
	}

	falsey(result, message) {
		if (!result) {
			return;
		} else {
			return this._handleFailure(message || `${result} is not truthy`);
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
		this.messages = [];
	}

	/**
	 * @param message: String - error message to add
	 * @throws Error if message is not of type string
	 */
	add(message) {
		if (typeof message != "string") throw new Error(`${message} should be of type String`);

		this.messages.push(message);
	}

	/**
	 * @return [string]: copy of 'this.messages'
	 */
	get errors() {
		return this.messages.slice();
	}

	/**
	 * @param formatted: boolean - true if color format printed errors
	 */
	printErrors(formatted) {
		if (!formatted)
			this.messages.forEach((message) => console.log(message));
		else
			this.messages.forEach((message) => console.log('\x1b[31m', `Error: ${message}`));
		console.log('\x1b[0m', '\n'); // clear console font color from red
	}
}