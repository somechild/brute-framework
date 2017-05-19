import { Weaver, Collector } from '../helpers/utils';
import { maxWovenInsertionAttempts as maxAttempts } from '../helpers/constants';

const uuid = require('uuid');

export default class Design {

	/*****--- change these as framework evolves ---*****/

	static getRequiredItems() {
		return {
			requiredProps: ["collection", "items"], // required for all designs

			dynamicRequiredProps: ["endpoint"], // for dynamic fields (defined by route queries)
			staticRequiredProps: ["matchPattern"], // for staticly defined fields (predefined in design)
		};
	}

	/*****--- ---*****/

	/**
	 * @param design: user-configured design
	 * @throws Error if invalid design layout
	 * @throws Error if unexpected error initializing page with unique id
	 */
	constructor(design) {
		this.layout = design;

		this._id = uuid();
		let insertionAttempts = maxAttempts;
		while(!Weaver.insert(this) && insertionAttempts --> 0)
			this._id = uuid();
		if (!insertionAttempts) throw new Error('Unexpected error initializing ${this.constructor.name} class with design ${design}');

	}

	get id() {
		return this._id;
	}

	get layout() {
		return this.design;
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

		// update all the undefined uniqueByItems to conform to associated collection's configurations
		for (let prop in newDesign) {
			const descriptionItem = newDesign[prop];	
			if (typeof descriptionItem.uniqueByItem == "undefined") {
				const uniqueBy = Collector.getQuerier().in(descriptionItem.collection).getContext().indexingProp; // should not throw error as we just validated existence of associated Collection instance in 'Design.validate(this)''
				newDesign[prop].uniqueByItem = uniqueBy;
			}
		}

		this.design = newDesign; // update design with the newly filled 'uniqueByItem' fields
		return old;
	}

	/**
	 * validate an object to see if it is a proper design class with a valid layout
	 * @param o: any variable to check
	 * @return true if valid
	 */
	static validate(o) {
		if (!(o instanceof Design)) return false;

		let layout = o.layout;
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

			let CollectionExists = true;
			let collectionItem = Collector.getQuerier();
			try {
				collectionItem.in(descriptionItem.collection); // throws error if collection with name in param does not exist
			} catch(e) {
				CollectionExists = false;
			}
			if (!CollectionExists) {
				return console.log(`${descriptionItem.collection} is not a defined collection.`) && false;
			} else {
				collectionItem = collectionItem.getContext(); // get the actual collection instance
			};

			let uniqueBy = collectionItem.indexingProp;
			if(typeof descriptionItem.uniqueByItem != "undefined" && descriptionItem.uniqueByItem != uniqueBy) {
				return console.log(`Invalid 'uniqueByItem' property value: ${descriptionItem.uniqueByItem}. The collection ${descriptionItem.collection}'s unique property is already set to ${uniqueBy}. Your design's 'uniqueByItem' property value should match.`) && false;
			};
		}

		return true;
	}
	
}