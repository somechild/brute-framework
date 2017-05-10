import { ExpressionEvaluator, EntryWrapper } from './ExpressionEvaluator';
import Collection from '../Woven/Collection';

const cheerio = require('cheerio');
const fs = require('fs');
const handlebars = require('handlebars');
const uuid = require('uuid');

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
 * to add and remove entries from collections
 */
export class Collector {
	/**
	 * initialize collection space on the global bruteframework space
	 * @return true if initialized. false if already exists
	 */
	static initializeSpace() {
		if(!global.bruteframework)
			global.bruteframework = {};
		if(!global.bruteframework.collections) {
			global.bruteframework.collections = {};
			return true;
		}
		return false;
	}

	/**
	 * set global.bruteframework.collections to be an empty object
	 */
	static clearSpace() {
		if(!global.bruteframework)
			global.bruteframework = {};
		global.bruteframework.collections = {};
	}

	/**
	 * add collection to collection space
	 * @param instance: object -- instance of Collection to add to space
	 * @return true if added. false if collection space has not been initialized OR if collection already exists with same name.
	 */
	static addCollection(instance) {
		const collectionSpace = getSafe(global, 'bruteframework.collections');
		if (!collectionSpace) return console.log('collection space has not yet been initialized.') && false;
		if (collectionSpace[instance.name] instanceof Collection) return console.log(`Collection with name ${instance.name} already exists.`) && false;
		collectionSpace[instance.name] = instance;
		return true;
	}

	/**
	 * remove collection from collection space
	 * @param collectionName: string -- unique name of collection to drop
	 * @return true if successfully deleted. false if collection space has not been initialized or if there is no collection with matching name to delete.
	 */
	static dropCollection(collectionName) {
		const collectionSpace = getSafe(global, 'bruteframework.collections');
		if (!collectionSpace) return console.log('collection space has not yet been initialized.') && false;
		if (typeof collectionSpace[collectionName] == "undefined") return console.log(`Collection with name ${collectionName} does not exist`) && false;

		delete collectionSpace[collectionName];
		return true;
	}

	/**
	 * @return new instance of 'CollectionQuerier'
	 */
	static getQuerier() {
		return new CollectionQuerier();
	}
}

/**
 * to query collections
 */
class CollectionQuerier {
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
	 * @return self for method chaining
	 */
	with(collectionName) {
		let collection;
		if (typeof collectionName != "string" || !(collection = getSafe(global, `bruteframework.collections.${collectionName}`)))
			throw new Error("Collection with name '${collectionName}' does not exist.")

		this.context = collection;

		return this;
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
		if (this.context instanceof Collection && typeof queryObj == "object" && Object.keys(queryObj).length === 1) {
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

	/** 
	 * @return Collection if context has been defined
	 */
	getContext() {
		return this.context;
	}
};

/**
 * To process templates
 */
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
		if (!TemplateProcessor.validateTemplate(template)) throw new Error('Invalid template format');
		const old = this.template;
		this.template = template;
		return old;
	}

	/**
	 * @param data
	 * @return string: template context processed with data
	 */
	processWith(data) {
		let compiledTemplate = handlebars.compile(this.template);
		return compiledTemplate(data);
	}

	/**
	 * @param template
	 * @return true if valid template
	 */
	static validateTemplate(template) {
		let returner;
		try {
			let compiledTemplate = handlebars.compile(template);
			let data = {};
			returner = compiledTemplate(data) && true;
		} catch(e) {
			console.log(e.message + '\n');
			console.log(e.stack);
		} finally {
			return returner;
		}
	}
}

/**
 * To manage the woven class instance space
 */
export class Weaver {
	/**
	 * @param classNames: [string] - list of woven class names to initialize space for
	 * @return true if sucessful
	 */
	static initializeSpace(classNames) {
		if(!global.bruteframework)
			global.bruteframework = {};
		if(!global.bruteframework.weaveClasses)
			global.bruteframework.weaveClasses = {};
		for (let className of classNames) {
			if (!global.bruteframework.weaveClasses[className])
				global.bruteframework.weaveClasses[className] = new Map();
			else return false;
		}
		return true;
	}

	/**
	 * set global.bruteframework.weaveClasses to be an empty object
	 */
	static clearSpace() {
		if(!global.bruteframework)
			global.bruteframework = {};
		global.bruteframework.weaveClasses = {};
	}

	/**
	 * @return instance of one of the framework's underlying classes (Route, DataModel, etc.)
	 */
	static query(className, classId) {
		return getSafe(global, `bruteframework.weaveClasses.${className}`, (classInstancesMap) => {
			return classInstancesMap.get(classId);
		});
	}

	/**
	 * @param instance: object - instance of class to insert
	 * @param className: string - name of class that object is instance of
	 * @return false if item with same ID if exists in map
	 */
	static insert(instance) {
		const classMap = getSafe(global, `bruteframework.weaveClasses.${instance.constructor.name}`);
		if (!classMap) throw new Error(`Class with name ${instance.constructor.name} does not exist.`);

		if (classMap.get(instance.id))
			return false;

		return classMap.set(instance.id, instance) || true;
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
		for (let prop in temp2) {
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
 * recursively delete all files in a directory (and its subdirectories)
 * @param dirPath: string - path to directory
 * @throws Error if invalid param or if dir does not exist at specified path
 */
export function emptyDir(dirPath) { // empty dir method
	if (typeof dirPath != "string" || !fs.existsSync(dirPath))
		throw new Error(`Invalid dirPath param: ${dirPath}. Either the param is not a string or a folder does not exist at specified path.`);
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
	if (typeof o != "object" || Array.isArray(o)) return;
	let runner = o;
	const props = str.split('.');
	for (let prop of props) {
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
 * NOTE: this method will also unwrap values from EntryWrapper objects
 * Ex. [['joe', 'jane'], 'jordan', ['jack', ['jill', 'jeff']]] --> ['joe', 'jane', 'jordan', 'jack', 'jill', 'jeff']
 * @param arr: array to unwrap
 * @return unwrapped array
 */
export function unwrap(arr) {
	let unwrapped = [];
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] instanceof EntryWrapper) {
			arr[i] = arr[i].value;
		}
		if (Array.isArray(arr[i])) {
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