export function println(str) {
	console.log(`\n${str}\n`);
}

export function EmptyTemplate() {
	return "<p>You have not initialized a template for this page yet</p>";
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
	if (executeOnSuccess) {
		return executeOnSuccess(runner);
	};
	return runner;
}