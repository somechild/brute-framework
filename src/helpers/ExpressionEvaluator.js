import { easymerge, checkNotEmptyIfArray } from './utils';

export class EntryWrapper { // wrap so there are no type conflicts while parsing multiple data
	constructor(data) {
		this.data = data;
	}
	get value() {
		return this.data;
	}
	set value(data) {
		const old = this.data;
		this.data = data;
		return old;
	}
}

export class ExpressionEvaluator {
	/** public methods **/

	/**
	 * evaluate an expression string and search against a property in a collection
	 * @param expr: String - user defined expression to match against
	 * @param matchKey: String - key/property to match expression against
	 * @param collectionContext: Collection - collection with matchKey to search expression in
	 * @return Array of results
	 */
	static evaluate(expr, matchKey, collectionContext) {
		let parsedExpr = this.parseBrackets(expr);

		if (typeof parsedExpr == "string") return this.simpleExpressionEval(parsedExpr, matchKey, collectionContext);
		return this.compoundExpressionEvalLoop(parsedExpr, matchKey, collectionContext);
	}

	/** private methods **/

	/**
	 * recursively parse string with brackets to an array with nested arrays for sub-expressions (break down to simplest of expressions)
	 * Ex. "{{foo&&{{bar||foobar}}}}^^baz" --> [["foo, "&&", ["bar||foobar"]], "^^", "baz"]
	 * @param str: string with brackets '{{', '}}' to parse into arrays and nested sub-arrays
	 * @return original str if no brackets are in str. else Array with nested arrays and broken down expressions
	 */
	static parseBrackets(str) {
		let parsedResult = this.parseShallowBrackets(str);
		if (typeof parsedResult == "string") return str;
		for (let i = 0; i < parsedResult.length; i++) {
			if (Array.isArray(parsedResult[i])) {
				parsedResult[i] = this.parseBrackets(parsedResult[i][0]);
			};
		}
		return parsedResult;
	}

	/**
	 * parse the first level of brackets - ignoring nested brackets
	 * Ex. "{{foo&&{{bar||foobar}}}}^^baz" --> [["foo&&{{bar||foobar}}"], "^^", "baz"]
	 * @param str: string with expressions nested using brackets
	 * @return Array with shallowly parsed brackets or original str if no brackets found
	 */
	static parseShallowBrackets(str) {
		let stack = [], breakdown = [], isCompound;
		let tempStr = '';
		for (let i = 0; i < str.length; i++) {
			if(str[i] == '{' && str[i + 1] == '{') {
				isCompound = true;
				stack.push(i);
				i++;
				if (tempStr.length) {
					breakdown.push(tempStr);
					tempStr = '';
				};
			} else if(str[i] == '}' && str[i + 1] == '}') {
				let start = stack.pop();
				if (stack.length == 0) {
					breakdown.push([str.substring(start+2, i)]);
				};
				i++;
			} else if(stack.length == 0) {
				if ((str[i] == '|' || str[i] == '&' || str[i] == '^') && str[i] == str[i+1]) { // todo check for character escaping
					if (tempStr.length) {
						breakdown.push(tempStr);
						tempStr = '';
					};
					breakdown.push(str[i] + str[i+1]);
					i++;
				} else {
					tempStr += str[i];
				};
			};
		}
		if (tempStr.length) {
			breakdown.push(tempStr);
			tempStr = '';
		};
		return isCompound? breakdown: str;
	}

	/**
	 * loop to recursively evaluate an expression broken down into arrays and sub-arrays
	 * @param parsedExpression: Array - string expression with brackets broken down into arrays and sub-arrays
	 * @param key: key to match expression against
	 * @param collectionContext: collection to search in
	 * @return Array with results of expression evaluated and searched within collection
	 */
	static compoundExpressionEvalLoop(parsedExpression, key, collectionContext) {
		let evaluated = [];
		for (let item of parsedExpression) {
			if (evaluated.length == 3) {
				evaluated = this.collapseLogic(evaluated);
			};

			if (typeof item == "string") {
				if (item == '&&' || item == '||' || item == '^^') {
					evaluated.push(item);
				} else {
					evaluated.push(this.simpleExpressionEval(item, key, collectionContext));
				};
			} else { // it's an array
				evaluated.push(this.compoundExpressionEvalLoop(item, key, collectionContext));
			};
		}
		if (evaluated.length == 3)
				return this.collapseLogic(evaluated);
		return evaluated;
	}

	/**
	 * evaluate an expression with no brackets
	 * @param expr: String - simple expression
	 * @param key: String - key to match expression against
	 * @param collectionContext: Collection - collection to search in
	 * @return Array with result of expression searched in collection 
	 */
	static simpleExpressionEval(expr, key, collectionContext) {
		let breakdown = [], tempstr = "";

		for (let i = 0; i < expr.length; i++) {
			if ((expr[i] == '&' || expr[i] == '|' || expr[i] == '^') && expr[i] == expr[i+1]) {
				if (tempstr.length) {
					breakdown.push(tempstr);
					tempstr = "";
				};
				breakdown.push(expr[i] + expr[i+1]);
				i++;
			} else {
				tempstr += expr[i];
			};
		};

		if (tempstr.length) { // this should always be true
			breakdown.push(tempstr);
			tempstr = "";
		} else {
			throw new Error(`Invalid! Expression ends in logical operator: ${expr}`);
		};


		let toRet = [];
		for (let item of breakdown) {
			if (item != '&&' && item != '||' && item != '^^') {
				const entry = new EntryWrapper(collectionContext.find({ [key]: item }));
				if (breakdown.length > 1 || (breakdown.length == 1 && typeof entry.value != "undefined")) {
					toRet.push(entry);
				};
			} else {
				toRet.push(item);
			};

			if (toRet.length == 3) {
				toRet = this.collapseLogic(toRet);
			};
		}
		if (toRet.length == 3) return this.collapseLogic(toRet, true);
		return toRet;
	}

	/**
	 * collapse a logic array into an array with a single item or no items
	 	-> for cases of AND and COMBINE which reduce to a single array, if items are arrays, they will be merged
		-> if you do not want arrays merged, wrap them in an EntryWrapper object
	 * AND Ex.
	 		[undefined, "&&", {"name": "joe"}] --> []
	 		[[], "&&", "joe"] --> []
	 		[[undefined], "&&", "joe"] --> []
	 		[ "jane", "&&", "joe"] --> [["jane", "joe"]]
	 		[["jane", "joe"], "&&", "jack"] --> [["jane", "joe", "jack"]]
	 		[["jane", "joe"], "&&", ["jack", "jill"]] --> [["jane", "joe", "jack", "jill"]]
	 * OR Ex.
	 		[undefined, "||", {"name": "joe"}] --> [{"name": "joe"}]
	 		["jane", "||", "joe"] --> ["jane"]
	 * COMBINE Ex.
	 		[undefined, "^^", {"name": "joe"}] --> [{"name": "joe"}]
	 		["jane", "^^", "joe"] --> [["jane", "joe"]]
	 		["jane", "^^", ["joe", "jack"]] --> [["jane", "joe", "jack"]]
	 * @param logicArray: Array - 3-element array of form [item1, logicalExpressionString, item2]
	 *		--> logicalExpressionString: '&&' is logical AND, '||' is logical OR, '^^' is a combining operation (combines all defined items)
	 * @param final: if true, placeholder 'undefined' will not be placed
	 * @return empty array if logical AND is not true. array with first elemnt being an array of items if ^^ or && used. array with either item1 or item2 as the first element if || used.
	 */
	static collapseLogic(logicArray, final) {
		let collapsed;
		const first = checkNotEmptyIfArray(logicArray[0]), second = checkNotEmptyIfArray(logicArray[2]);
		if (logicArray[1] == '^^' || (logicArray[1]  == '&&' && first && second)) {
			collapsed = [easymerge(logicArray[0], logicArray[2])];
		} else if(logicArray[1] == '||' && (first || second)) {
			collapsed = [first? easymerge(logicArray[0]): easymerge(logicArray[2])];
		} else {
			collapsed = final? []: [new EntryWrapper(undefined)];
		};
		return collapsed;
	}
}