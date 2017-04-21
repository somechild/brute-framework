import { Weaver } from '../helpers/utils';
import { maxWovenInsertionAttempts as maxAttempts } from '../helpers/constants';

const uuid = require('uuid');

export default class Design {

	/*****--- change these as framework evolves ---*****/

	static getRequiredItems() {
		return {
			requiredProps: ["collection", "items", "uniqueByItem"],
			dynamicRequiredProps: ["endpoint"],
			staticRequiredProps: ["matchPattern"],
		};
	}

	/*****--- ---*****/

	/**
	 * @param design: user-configured design
	 * @throws Error if invalid design layout
	 * @throws Error if unexpected error initializing page with unique id
	 */
	constructor(design) {
		this._id = uuid();
		let insertionAttempts = maxAttempts;
		while(!Weaver.insert(this) && insertionAttempts --> 0)
			this._id = uuid();
		if (!insertionAttempts) throw new Error('Unexpected error initializing ${this.constructor.name} class with design ${design}');

		this.design = design;
		if(!Design.validate(this))
			throw new Error(`Invalid design layout: ${design}`);
	}

	get layout() {
		return this.design;
	}

	get id() {
		return this._id;
	}

	/**
	 * @param newDesign: new design to set
	 * @throws error if invalid design layout & reverts to old layout
	 * @return old layout
	 */
	set layout(newDesign) {
		const old = this.design;
		this.design = newDesign;
		if (!Design.validate(this)) {
			this.design = old;
			throw new Error(`Invalid design layout: ${newDesign}`)
		}
		return old;
	}

	/**
	 * validate an object to see if it is a proper design class with a valid layout
	 * @param o: any variable to check
	 * @return true if valid
	 */
	static validate(o) {
		if (!(o instanceof Design)) return false;

		const layout = o.layout;
			if (!layout || typeof layout != "object" || Array.isArray(layout)) return false;

		const { requiredProps, dynamicRequiredProps, staticRequiredProps } = this.getRequiredItems();
		for (let prop in layout) {
			let descriptionItem = layout[prop];
			if (!descriptionItem || typeof descriptionItem != "object" || Array.isArray(descriptionItem)) return false;
			for (let requiredProp of requiredProps) {
				if (!(requiredProp in descriptionItem)) return false;
			}
			if (descriptionItem.useDynamicPattern) {
				for (let requiredProp of dynamicRequiredProps) {
					if (!(requiredProp in descriptionItem)) return false;
				}
			} else {
				for (let requiredProp of staticRequiredProps) {
					if (!(requiredProp in descriptionItem)) return false;
				}
			};
		}

		return true;
	}
	
}