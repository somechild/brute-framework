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