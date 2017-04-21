import { Collector, Weaver } from '../helpers/utils';
import { maxWovenInsertionAttempts as maxAttempts } from '../helpers/constants';

import Design from './Design';
import Route from './Route';

const uuid = require('uuid');

export default class DataModel {
	/**
	 * @param design: the design of the object that the route's template needs to parse handlebars
	 * @param route: route that this DataModel is associated with
	 * @throws Error if unexpected error initializing page with unique id
	 */
	constructor(design, route) {
		this._id = uuid();
		let insertionAttempts = maxAttempts;
		while(!Weaver.insert(this) && insertionAttempts --> 0)
			this._id = uuid();
		if (!insertionAttempts) throw new Error('Unexpected error initializing ${this.constructor.name} class with model design ${desgin}');

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
		if (!Design.validate(newDesign))
			throw new Error("Invalid design structure");
		const old = this.design;
		this.design = newDesign;
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
		let querier = Collector.getQuerier();

		for (let sectionName in design) {
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