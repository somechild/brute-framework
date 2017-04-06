import { easymerge } from 'utils';

export default class ExpressionEvaluator {
		/** public methods **/

		static simple(expr, key, collectionContext) {
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
		static compound(expr, key, collectionContext) {
			return this.compoundEvalLoop(this.parseBrackets(expr), key, collectionContext);
		}



		/** private methods **/

		static compoundEvalLoop(parsedExpression, key, collectionContext) {
			let evaluated = [];
			for (let item of parsedExpression) {
				if (evaluated.length == 3)
					this.collapseLogic(evaluated);

				if (typeof item == "string") {
					if (item == "&&" || item == "||") {
						evaluated.push(item);
					} else {
						evaluated.push(this.simple(item, key, collectionContext));
					};
				} else { // it's an array
					evaluated.push(this.compoundEvalLoop(item, key, collectionContext));
				};
			}

			if (evaluated.length == 3)
					this.collapseLogic(evaluated);
			return evaluated;
		}
		static collapseLogic(logicArray) {
			let collapsed;
			if (logicArray[1] == '||') {
				collapsed = [(logicArray[0] || logicArray[2])];
			} else {
				collapsed = [easymerge(logicArray[0], logicArray[1])];
			};
			return collapsed;
		}
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
		static parseShallowBrackets(str) {
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