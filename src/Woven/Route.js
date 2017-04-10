import { Weaver } from '../helpers/utils';
import { maxWovenInsertionAttempts as maxAttempts } from '../helpers/constants';

const fs = require('fs');
const uuid = require('uuid');

export class Route {
	/**
	 * create route with unique id, unique user-defined name
	 * @param design: instance of Design specifying format of object used by the route's template
	 * @param config: Object with templatePath prop to specify path to template associated with route & name prop to associate unique name with this route
	 * @throws Error if unexpected error initializing page with unique id
	 */
	constructor(design, config) {
		let { templatePath, name } = config;

		this.name = name;
		this._id = uuid();
		while(!Weaver.insert(this) && insertionAttempts > 0) {
			this._id = uuid();
			insertionAttempts--;
		}
		if (!insertionAttempts) throw new Error('Unexpected error initializing ${this.constructor.name} class with route name ${name}');

		const model = new DataModel(design, this);
		const pageContainer = new PageContainer(templatePath);

		this.modelId = model.id;
		this.pageContainerId = pageContainer.id; 
	}

	get id() {
		return this._id;
	}

	get name() {
		return this.name;
	}

	/**
	 * update template path
	 * @param {optional} newPath: String -- path to new template
	 * 		--> {defualt} refresh cached template
	 */
	updateTemplate(newPath) {
		const pageContainer = this.pageContainer;
		if (!newPath) {
			newPath = pageContainer.getTemplatePath();
		}
		pageContainer.setTemplate(newPath);
	}

	/**
	 * @return DataModel instance - model associated with route
	 */
	get model() {
		return Weaver.query('DataModel', this.modelId);
	}


	/**
	 * @return PageContainer instance - container associated with route
	 */
	get pageContainer() {
		return Weaver.query('PageContainer', this.pageContainerId);
	}

	/**
	 * get HTML file based on Pattern instance
	 * @param pattern instance to match file against
	 * @throws Error if pattern is invalid
	 * @return path to file matching pattern
	 */
	getFileWithPattern(pattern) {
		if (!Pattern.validate(pattern)) throw new Error(`Invalid pattern ${pattern}`);
		const model = this.model;
		const pageContainer = this.pageContainer;

		const data = model.getDataInstance(pattern);
		const page = pageContainer.getPageWithData(pattern, data);

		return page.getFile();
	}
}