import { CollectionQuerier } from './utils';
const uuid = require('uuid');

class DataModel {
	/**
	 * @param design: the design of the object that the route's template needs to parse handlebars
	 * @param route: route that this DataModel is associated with
	 */
	constructor(design, route) {
		this._id = uuid();

		if (route instanceof Route) {
			this.route = route.id;
		};

		this.setDesign(design);
	}

	get id() {
		return this._id;
	}

	/**
	 * @param newDesign: set a new design for the datamodel
	 * @return old design
	 */
	setDesign(newDesign) {
		if (!Design.validate(design))
			throw new Error("Invalid design structure");
		const old = this.design;
		this.design = design;
		return old;
	}

	/** 
	 * @param newRoute: associated datamodel with a new route (route must already have this DataModel set as its model)
	 * @return old routeId
	 */
	setRoute(newRoute) {
		if (newRoute instanceof Route && newRoute.getModel() === this.id) {
			const old = this.route; 
			this.route = newRoute.id;
			return old;
		} else {
			throw new Error(`Route object is invalid, or does not point to this model already.`);
		};
	}

	/**
	 * @param pattern: a valid Pattern for matching the dynamic properties of the model to collection data
	 * @return an object instance formatted as per this model's 'design' & containing values matching pattern from latest Collection documents
	 */
	getDataInstance(pattern) {
		if (!Pattern.validate(pattern))
			throw new Error(`Invalid pattern ${pattern}`);

		let o = {};
		const design = this.design.layout;
		let querier = new CollectionQuerier();

		for (sectionName in design) {
			const section = design[sectionName];
			let query = {};
			query[section.uniqueByItem] = section.matchPattern || pattern.breakdown[section.endpoint];
			const matches = querier.with(section.collection).find(query);
			if (!matches)
				throw new Error(`No matches found for pattern ${pattern}`);
			
			o[sectionName] = Pattern.parseResults({
				matches,
				originalExpression: query[section.uniqueByItem],
				items: section.items,
			});
		}
		return o;
	}
}