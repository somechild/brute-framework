import ExpressionEvaluator from 'ExpressionEvaluator';

/** Objects & Classes **/

export let DefaultTemplates = {
	isEmpty() {
		return "<p>A template has not been initialized for this page yet</p>";
	}
	hasError() {
		return "<p>There was an error finding the template for this page</p>";
	}
}


export class CollectionQuerier {
	constructor() {
		this.context = null;
	}
	with(collectionName) {
		let collection;
		if (typeof collectionName != "string" || !(collection = getSafe(global, `bruteframework.collections.${collectionName}`)))
			throw new Error("Collection with name '${collectionName}' does not exist.")

		this.context = collection;
	}
	find(queryObj) {
		if (this.context instanceof Colection && typeof queryObj == "object" && Object.keys(queryObj).length === 1) {
			const key = Object.keys(queryObj)[0];
			let expression = queryObj[key];
			if (expression == '*') {
				return this.context.findAll();
			} else {
				ExpressionEvaluator[(expression.find('{{') == -1? 'simple': 'compound')](expression, key, this.context);
			};
		};

		return [];
	}
};



/** Methods **/
export function println(str) {
	console.log(`\n${str}\n`);
}

export function findByProp(arr, prop, val, getIndex) {
	for (let i = 0; i < arr.length; i++) {
		if(arr[i][prop] == val)
			return getIndex? arr[i]: i;
	};
	return getIndex && -1;
}

export function weaveQuery(className, classId) {
	return getSafe(global, `bruteframework.weaveClasses.${className}`, (classInstancesMap) => {
		return classInstancesMap.get(classId);
	});
}

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

export function getConfigs() {
	return getSafe(global, 'bruteframework.configs');
}

export function easymerge() {
	let toRet = [];
	for (let arg of arguments) {
		if (Array.isArray(arg)) {
			arg.forEach((item) => toRet.push(item));
		} else {
			toRet.push(arg);
		};
	}
	return toRet;
}
