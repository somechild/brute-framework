import { println, EmptyTemplate } from 'utils';

const uuid = require('uuid');
const fs = require('fs');
const cheers = require('cheerio');

class PageContainer {
	constructor(templatePath) {
		this._id = uuid();
		this.asyncFileRead = "";
		this.templateString = EmptyTemplate();
		this.pages = new Map();

		if (typeof templatePath == "string")
			this.setTemplate(templatePath);
	}

	setTemplate(path) {
		try {
			if (!fs.existsSync(path)) throw new Error('File does not exist.');
			this.asyncFileRead = path;
			fs.readFile(path, "utf-8", (err, template) => {
				if (err) throw err;
				if (this.asyncFileRead != path) return this;

				this.asyncFileRead = "";
				this.templateString = template;
				this.templatePath = path;
			});
		} catch(e) {
			if (this.asyncFileRead == path)
				this.asyncFileRead = "";
			println("Error. Invalid filepath: " + TemplatePath);
			console.log(e.stack);
		}
	}

	getPage(pattern) {
		return this.pages.get(pattern.stringify());
	}

	getPageWithData(pattern, data) {
		let page = this.pages.get(pattern.stringify());
		if (!page)
			return this.createPage(data, pattern.stringify());
		page.recomputeData(data);
		return page;
	}

	createPage(data, pattern) {
		let page = new Page(data, pattern.striginify(), this._id);
		this.pages.push(page);
		return page;
	}

	getTemplatePath() {
		return this.templatePath;
	}
}