import { weaveQuery } from 'utils';

const fs = require('fs');
const uuid = require('uuid');

class Route {
	constructor(design, config) {
		let { templatePath, name } = config;

		this.name = name;
		this._id = uuid();

		const model = new DataModel(design, this);
		const pageContainer = new PageContainer(templatePath);

		this.model = model.getId();
		this.pageContainer = pageContainer.getId(); 
	}

	getId() {
		return this._id;
	}

	getName() {
		return this.name;
	}

	updateTemplate(newPath) {
		const pageCont = weaveQuery('PageContainer', this.pageContainer);
		if (!newPath) {
			newPath = pageCont.getTemplatePath();
		}
		pageCont.setTemplate(newPath);
	}

	getModel() {
		return this.model;
	}

	getFile() {
		
	}
}