import { ExpressionEvaluator, EntryWrapper } from './ExpressionEvaluator';
const uuid = require('uuid')
const cheerio = require('cheerio');


/** Objects & Classes **/
/**
 * fallback templates for 'graceful' failures
 */ 
export let DefaultTemplates = {
	isEmpty() {
		return "<p>A template has not been initialized for this page yet</p>";
	},
	hasError() {
		return "<p>There was an error finding the template for this page</p>";
	}
}

/**
 * to query collections
 */
export class CollectionQuerier {
	/**
	 * declares context variable
	 */
	constructor() {
		this.context = null;
	}

	/**
	 * set the context of the proceeding queries
	 * @param collectionName: name of the collection the be queried
	 * @throws Error if collection with name of 'collectionName' does not exist
	 */
	with(collectionName) {
		let collection;
		if (typeof collectionName != "string" || !(collection = getSafe(global, `bruteframework.collections.${collectionName}`)))
			throw new Error("Collection with name '${collectionName}' does not exist.")

		this.context = collection;
	}

	/**
	 * run query on the collection set in context
	 * @param queryObj: an object with 1 property
	 * 		--> Property name is key to match in collection.
	 * 		--> Property value is the expression to evaluate and match
	 *		--> ex. {name: "{{john&&jane}}^^{{joe}}||{{jackie}}"} will get the following collection entries:
	 				if entries with 'name' set to john and jane both exist, they both will be added to the returned result
	 				if an entry with 'name' set to joe exists, that will be added to the returned result
	 				if niether john, nor john AND jane exist, fallback to an entry with name set to 'jackie'
	 */
	find(queryObj) {
		if (this.context instanceof Colection && typeof queryObj == "object" && Object.keys(queryObj).length === 1) {
			const key = Object.keys(queryObj)[0];
			let expression = queryObj[key];
			if (expression == '*') {
				return this.context.findAll();
			} else {
				return ExpressionEvaluator.evaluate(expression, key, this.context);
			};
		};

		return [];
	}
};

export class TemplateProcessor {
	/**
	 * @param template
	 * @throws Error if invalid template format
	 */
	constructor(template) {
		this._id = uuid();
		this.setTemplate(template);
	}

	get id() {
		return this._id;
	}
	
	/**
	 * @param template
	 * @throws Error if invalid template format
	 * @return old template
	 */
	setTemplate(template) {
		if (!this.validateTemplate(template)) throw new Error('Invalid template format');
		const old = this.template;
		this.template = template;
		return old;
	}

	/**
	 * @param data
	 * @return
	 */
	processWith(data) {
		// fk
	}

	/**
	 * @param template
	 * @return true if valid template
	 */
	static validateTemplate(template) {
		// fk
	}
}



/** Methods **/

/**
 * @param o: anything
 * @return true if o is an array and consists of values that are not all undefined
 */
export function checkNotEmptyIfArray(o)  {
	if (o && Array.isArray(o)) {
		return o.length && o.reduce((accum, cur) => accum || (typeof cur != "undefined"), false);
	};
	return o;
}

/**
 * match multiple objects by individual property
 * @params: objects to compare
 */
export function deepMatch() {
	for(let i = 1; arguments[i]; i++) {
		const temp1 = arguments[i-1];
		const temp2 = arguments[i];

		if (Object.keys(temp2).length != Object.keys(temp1).length)
			return false;
		for (prop in temp2) {
			if (temp2[prop] != temp1[prop])
				return false;
		}
	}
	return true;
}

/**
 * merges items-into-arrays, merges arrays-with-arrays, and combines multiple items into an array
 * @params: arrays are unwrapped & all other types are treated as 'items'
 * @return items unwrapped from arrays and items passed as parameters are combined into one array and returned
 */
export function easymerge() {
	let toRet = [];
	for (let arg of arguments) {
		if (Array.isArray(arg)) {
			arg.forEach((item) => {
				if (typeof item != "undefined") toRet.push(item);
			});
		} else if(typeof arg != "undefined" && ( (arg instanceof EntryWrapper && typeof arg.value != "undefined") || !(arg instanceof EntryWrapper) )) {
			toRet.push(arg);
		};
	}
	return toRet;
}

/**
 * find an object in an array by property
 * @param arr: array to search in
 * @param prop: property of object in array to check
 * @param val: value the property the object should match
 * @param getIndex: truthy if you wold like method to return index of matched element rather than element itself
 * @return index of matched elment or matched element itself. if fails, return -1 or undefined.
 */
export function findByProp(arr, prop, val, getIndex) {
	for (let i = 0; i < arr.length; i++) {
		if(arr[i][prop] == val)
			return getIndex? arr[i]: i;
	};
	return getIndex && -1;
}

/**
 * @return framework user configurations
 */
export function getConfigs() {
	return getSafe(global, 'bruteframework.configs');
}

/**
 * safely chain property access in objects
 * @param o: object to operate on
 * @param str: properties to chain access. seperated by a '.' -- ex. 'profile.name.firstName' of a hypothetical 'userObject'
 * @param executeOnSucces: method to run on final value if successfully accessed final property
 * @return value of final property or returned value of executeOnSuccess method if successful. undefined if failed.
 */
export function getSafe(o, str, executeOnSuccess) {
	let runner = o;
	const props = str.split('.');
	for (const prop of props) {
		if (!(prop in runner)) return;
		runner = runner[prop];
	};
	if (executeOnSuccess) return executeOnSuccess(runner);
	return runner;
}

/**
 * prints a string with line breaks above and below
 * @param str: item to print
 */
export function println(str) {
	console.log(`\n${str}\n`);
}

/**
 * Unwrap array with non-array items nested in sub-arrays
 * Note: this method will also unwrap values from EntryWrapper objects
 * Ex. [['joe', 'jane'], 'jordan', ['jack', ['jill', 'jeff']]] --> ['joe', 'jane', 'jordan', 'jack', 'jill', 'jeff']
 * @param arr: array to unwrap
 * @return unwrapped array
 */
export function unwrap(arr) {
	let unwrapped = [];
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] instanceof EntryWrapper) {
			unwrapped.push(unwrapped[i].value);
		} else if (Array.isArray(arr[i])) {
			let temp = unwrap(arr[i]);
			for (let item of temp) {
				unwrapped.push(item);
			}
		} else if(typeof arr[i] != "undefined") {
			unwrapped.push(arr[i]);
		}
	};
	return unwrapped;
}

/**
 * @return instance of one of the framework's underlying classes (Route, DataModel, etc.)
 */
export function weaveQuery(className, classId) {
	return getSafe(global, `bruteframework.weaveClasses.${className}`, (classInstancesMap) => {
		return classInstancesMap.get(classId);
	});
}
