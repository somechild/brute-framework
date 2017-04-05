import { println, DefaultTemplates } from 'utils';

const uuid = require('uuid');
const fs = require('fs');
const cheers = require('cheerio');

class PageContainer {
	constructor(templatePath) {
		this._id = uuid();
		this.pages = new Map();

		if (typeof templatePath == "string")
			this.setTemplate(templatePath);
	}

	setTemplate(path) {
		if (!fs.existsSync(path)) throw new Error(`File does not exist at ${path}`);
		this.templatePath = path;
	}

	getPage(pattern) {
		return this.pages.get(pattern.stringify());
	}

	getPageWithData(pattern, data) {
		let page = this.pages.get(pattern.stringify());
		if (!page)
			return this.createPage(data, pattern);
		page.recomputeData(data);
		return page;
	}

	createPage(data, pattern) {
		let page = new Page(data, pattern, this._id);
		this.pages.set(pattern.stringify(), page);
		return page;
	}

	getTemplate() {
		try {
			return fs.readFileSync(this.getTemplatePath(), 'utf-8');
		} catch(e) {
			console.log(e.stack);
			console.log(e.message);
			return DefaultTemplates.hasError();
		}
	}

	getTemplatePath() {
		return this.templatePath;
	}
}