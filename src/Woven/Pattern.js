import { Weaver } from '../helpers/utils';
import { maxWovenInsertionAttempts as maxAttempts } from '../helpers/constants';

const uuid = require('uuid');

export default class Pattern {
	/**
	 * @param pattern: object - pattern to wrap in an instance of this class
	 * 				  NOTE: this is an object whose fields are the unique endpoints of a route, and values are the value in the endpoint request
	 * 				  ex. if data is to be queried by the 'name' field specified in design (uniqueBy), the pattern will look like this (sample route request may be: '/users?name=John||Jane' or '/users/name/John||Jane')
	 * 					 {
							"users": "John||Jane",
						 }
	 * @throws Error if pattern is invalid
	 * @throws Error if unexpected error initializing page with unique id
	 */
	constructor(pattern) {
		this._id = uuid();

		this.pattern = pattern;
		if (!Pattern.validate(this)) throw new Error(`Invalid pattern: ${pattern}`);
		
		let insertionAttempts = maxAttempts;
		while(!Weaver.insert(this) && insertionAttempts --> 0)
			this._id = uuid();
		if (!insertionAttempts) throw new Error('Unexpected error initializing ${this.constructor.name} class with pattern ${pattern}');
	}

	/**
	 * @return pattern wrapped in the instance of this class
	 */
	get breakdown() {
		return this.pattern;
	}

	get id() {
		return this._id;
	}

	/**
	 * @param newPattern: object - new pattern to replace pattern currently wrapped by the instance of this class
	 * @throws Error if new pattern is invalid & reverts class instance to old pattern
	 * @return old pattern
	 */
	set breakdown(newPattern) {
		const old = this.pattern;
		this.pattern = newPattern;
		if(!Pattern.validate(this)) {
			this.pattern = old;
			throw new Error(`Invalid pattern: ${pattern}`);
		};
		return old;
	}

	/**
	 * NOTE: this is effectively a hashcode
	 * @return alphabetically sorted string representation of pattern wrapped by the instance of this class
	 */
	stringify() {
		let o = "";
		let sortedProps = Object.keys(this.pattern).sort();
		for (let prop of sortedProps)
			o += `${prop}:${this.pattern[prop]}`;
		return o;
	}

	/**
	 * @param o: variable to validate
	 * @return true if variable is a valid instance of the Pattern class and is wrapping a valid pattern
	 */
	static validate(o) {
		if (!(o instanceof Pattern)) return false;
		const breakdown = o.breakdown;
		if (typeof breakdown != "object" || Array.isArray(breakdown)) return false;
		for (let prop in breakdown) {
			if (typeof breakdown[prop] != "string") return false;
		}
		return true;
	}

	/**
	 * parses results from CollectionQuerier (ExpressionEvaluator), based on an original match expression for inserting into properties of a data instance of DataModel & required items for this section as per design requirements
	 * --> data instances will later be used by handlebars on the HTML templates
	 * @param matchObj: object{matches, originalExpression, items} - matches is an Array of results retrieved from CollectionQuerier, originalExpression is a string with the expression used to retrieve aforementioned matches, items is an array of names of required properties to retrieve from the collection
	 * @return unwrapped and flattened array or single collection entry instance (if no AND or COMBINE logic used in originalExpression)
	 */
	static parseResults(matchObj) {
		// TODO: return array of objects if query 'expects array', rather than making individual fields arrays
		let { matches, originalExpression, items } = matchObj;
		let queryDoesNotExpectArray = originalExpression.indexOf('*') != -1 ? false : originalExpression.split('').reduce((accum, current, idx) => {
			return accum && !((current == '&' || current == '^') && current == originalExpression[i+1])
		}, true);

		let o = {};
		for (let item of items) {
			if (queryDoesNotExpectArray && matches[0]) {
				o[item] = matches[0][item];
			} else {
				o[item] = [];
				for (let match of matches) {
					if (typeof match != "undefined") {
						o[item].push(match[item]);
					};
				}
			};
		}

		return o;
	}
}