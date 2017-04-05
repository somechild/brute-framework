export function println(str) {
	console.log(`\n${str}\n`);
}

export let DefaultTemplates = {
	isEmpty() {
		return "<p>A template has not been initialized for this page yet</p>";
	}
	hasError() {
		return "<p>There was an error finding the template for this page</p>";
	}
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
			}
			else{
				this.expressionEval[(expression.find('{{') == -1)? 'simple': 'compound'](expression, key, this.context);
			};
		};

		return [];
	}

	get expressionEval() {
		return {
			simple(expr, key, collectionContexts) {
				let expression = expr.split('||');
				let isAnd;
				if (expression.length == 1) {
					expression = expression[0].split('&&');
					isAnd = true;
				};
				let toRet = [];
				for(let matchItem of expression) {
					const entry = collectionContext.findOne({ [key]: matchItem });
					if (typeof entry != undefined) {
						toRet.push(entry);
						if (!isAnd) return toRet;
					};
				}
				return toRet;
			}
			compoundExpressionEval(expr, key, collectionContexts) {
				let parsedExpr = parseBrackets(expr);

				// todo

			}
			parseBrackets(str) {
				let shallowRes = this.parseShallowBrackets(str);
				if (typeof shallowRes == "string") return str;
				for (let i = 0; i < shallowRes.length; i++) {
					if (Array.isArray(shallowRes[i])) {
						shallowRes[i] = this.parseBrackets(shallowRes[i][0]);
					};
				}
				return shallowRes;
			}
			parseShallowBrackets(str) {
				let stack = [], breakdown = [], isCompound;
				let tempStr = "";
				for (let i = 0; i < str.length; i++) {
					if(str[i] == '{' && str[i + 1] == '{') {
						isCompound = true;
						stack.push(i);
						i++;
						if (tempStr.length) {
							breakdown.push(tempStr);
							tempStr = "";
						};
					} else if(str[i] == '}' && str[i + 1] == '}') {
						let start = stack.pop();
						if (stack.length == 0) {
							breakdown.push([str.substring(start+2, i)]);
						};
						i++;
					} else if(stack.length == 0) {
						if (str[i] == '|' || str[i] == '&') {
							if (tempStr.length) {
								breakdown.push(tempStr);
								tempStr = "";
							};
							breakdown.push(str[i] + str[i+1]);
							i++;
						} else {
							tempStr += str[i];
						};
					};
				}
				return isCompound? breakdown: str;
			}
		}
	}
};

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