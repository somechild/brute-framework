import { CollectionQuerier } from 'utils';
const uuid = require('uuid');

class DataModel {
	constructor(design, route) {
		this._id = uuid();

		if (route instanceof Route) {
			this.route = route.getId();
		};

		this.setDesign(design);
	}

	setDesign(newDesign) {
		if (!Design.validate(design))
			throw new Error("Invalid design structure");
		this.design = design;
	}

	setRoute(newRoute) {
		if (newRoute instanceof Route && newRoute.getModel() === this.getId()) {
			this.newRoute = newRoute.getId();
		} else {
			throw new Error(`Route object is invalid, or does not point to this model already.`);
		};
	}

	getDataInstance(pattern) {
		if (!Pattern.validate(pattern))
			throw new Error(`Invalid pattern ${pattern}`);

		let o = {};
		const design = this.design;
		let querier = new CollectionQuerier();

		for (sectionName in design) {
			const section = design[sectionName];
			let query = {};
			query[section.uniqueByItem] = section.matchPattern || pattern[section.endpoint];
			const matches = querier.with(section.collection).find(query);
			if (!matches)
				throw new Error(`No matches found for pattern ${pattern}`);
			o[sectionName] = Pattern.parseResults(matches);
		}
		return o;
	}

	getId() {
		return this._id;
	}
}