import Design from './Design';
import Route from './Route';
import Pattern from './Pattern';

import { Collector, parseResults, unwrap, Weaver } from '../helpers/utils';
import { maxWovenInsertionAttempts as maxAttempts } from '../helpers/constants';

const uuid = require('uuid');

export default class DataModel {
	/**
	 * @param design: the design of the object that the route's template needs to parse handlebars
	 * @param route: route that this DataModel is associated with
	 * @throws Error if unexpected error initializing page with unique id
	 */
	constructor(design, route) {
		if (route instanceof Route) {
			this.$routeId = route.id;
		} else if(route) throw new Error(`Route object is invalid.`);

		this.design = design;
		
		this._id = uuid();
		let insertionAttempts = maxAttempts;
		while(!Weaver.insert(this) && insertionAttempts --> 0)
			this._id = uuid();
		if (!insertionAttempts) throw new Error('Unexpected error initializing ${this.constructor.name} class with model design ${desgin}');
	}

	get id() {
		return this._id;
	}

	/**
	 * @param newDesign: set a new design for the datamodel
	 * @return old design
	 */
	set design(newDesign) {
		if (!Design.validate(newDesign))
			throw new Error("Invalid design structure");
		const old = this.design;
		this.$designId = newDesign.id;
		return old;
	}

	get design() {
		return Weaver.query('Design', this.$designId);
	}

	/** 
	 * @param newRoute: associated datamodel with a new route (route must already have this DataModel set as its model)
	 * @return old routeId
	 */
	set route(newRoute) {
		if (newRoute instanceof Route && newRoute.model === this) {
			const old = this.route; 
			this.$routeId = newRoute.id;
			return old;
		} else {
			throw new Error(`Route object is invalid, or does not point to this model already.`);
		};
	}

	get route() {
		return Weaver.query('Route', this.$routeId);
	}

	/**
	 * @param pattern: a valid Pattern for matching the dynamic properties of the model to collection data
	 * @return an object instance formatted as per this model's 'design' & containing values matching pattern from latest Collection documents
	 */
	getDataInstance(pattern) {
		if (!Pattern.validate(pattern))
			throw new Error(`Invalid pattern ${pattern}`);

		let toReturn = {};
		const design = this.design.layout;
		let querier = Collector.getQuerier();

		for (let sectionName in design) {
			const section = design[sectionName];
			
			let query = {};
			query[section.uniqueByItem] = section.matchPattern || pattern.breakdown[section.endpoint];

			let matches = querier.in(section.collection).find(query);

			if (!matches || !matches.length)
				continue;
			matches = unwrap(matches);

			toReturn[sectionName] = parseResults({
				matches,
				originalExpression: query[section.uniqueByItem],
				items: section.items,
			});
		}
		return toReturn;
	}
}