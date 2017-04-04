import { println, EmptyTemplate } from 'utils';

const uuid = require('uuid');
const fs = require('fs');
const cheers = require('cheerio');

class PageContainer {
	constructor(templatePath, model) {
		this._id = uuid();
		this.asyncFileRead = "";
		this.templateString = EmptyTemplate();
		this.model = null;
		this.requiredProperties = [];
		this.pages = new Map();

		if (typeof templatePath == "string")
			this.setTemplate(templatePath);
		if (model instanceof DataModel)
			this.setModel(model);
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
				this.parseTemplate();
			});
		} catch(e) {
			if (this.asyncFileRead == path)
				this.asyncFileRead = "";
			println("Error. Invalid filepath: " + TemplatePath);
			console.log(e.stack);
		}
	}

	setModel(model) {
		if (!(model instanceof DataModel)) return this;
		var required = this.requiredProperties;
		for (var i = 0; i < required.length; i++) {
			if (!(required[i] in model)) return this; // throw error
		};
		this.model = model.getId();
		return this;
	}

	parseTemplate() {
		let props = [];
		let $ = cheers.load(this.templateString);
		$('handle').each((i, elem) => props.push($(elem).attr('prop')));
		this.requiredProps = props;
		return this;
	}

	getPage(pattern) {
		return this.pages.get(pattern);
	}

	getPageWithData(pattern, data) {
		let page = this.pages.get(pattern);
		if (!page)
			return this.createPage(data, pattern);
		page.recomputeData(data);
		return page;
	}

	createPage(data, pattern) {
		let page = new Page(data, pattern, this._id);
		this.pages.push(page);
		return page;
	}

	getTemplatePath() {
		return this.templatePath;
	}
}