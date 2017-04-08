import { weaveQuery } from './utils';

const fs = require('fs');
const uuid = require('uuid');

class Route {
	/**
	 * create route with unique id, unique user-defined name
	 * @param design: instance of Design specifying format of object used by the route's template
	 * @param config: Object with templatePath prop to specify path to template associated with route & name prop to associate unique name with this route
	 */
	constructor(design, config) {
		let { templatePath, name } = config;

		this.name = name;
		this._id = uuid();

		const model = new DataModel(design, this);
		const pageContainer = new PageContainer(templatePath);

		this.model = model.id;
		this.pageContainer = pageContainer.id; 
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
		const pageCont = weaveQuery('PageContainer', this.pageContainer);
		if (!newPath) {
			newPath = pageCont.getTemplatePath();
		}
		pageCont.setTemplate(newPath);
	}

	/**
	 * @return DataModel instance - model associated with route
	 */
	get model() {
		return this.model;
	}

	/**
	 * get HTML file based on Pattern instance
	 * @param pattern instance to match file against
	 * @return path to file matching pattern
	 */
	getFileWithPattern(pattern) {
		// TODO
	}
}