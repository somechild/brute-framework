import { println, EmptyTemplate } from 'utils';

const fs = require('fs');
const $ = require('cheerio');

class PageTemplate {
	constructor(TemplatePath, Model) {
		this.asyncFileRead = "";
		this.templateString = EmptyTemplate();
		this.model = {};
		this.modelBoiler = {};
		this.requiredProperties = [];

		if (typeof TemplatePath == "string")
			this.setTemplate(TemplatePath);
		if (typeof Model == "object")
			this.setModel(Model);
	}

	setTemplate(path) {
		try {
			$this = this;
			$this.asyncFileRead = path;

			fs.readFile(path, "utf-8", (err, template) => {
				if (err) throw err;
				if ($this.asyncFileRead != path)
					return;

				$this.asyncFileRead = "";
				$this.templateString = template;
				$this.parseTemplate();
			});
		} catch(e) {
			if (this.asyncFileRead == path)
				this.asyncFileRead = "";
			println("Error. Invalid filepath: " + TemplatePath);
			console.log(e.stack);
		}
	}

	setModel(model) {
		var required = this.requiredProperties;
		for (prop in model) {
			if (required.indexOf(prop) > -1) {
				this.model[prop] = model[prop];
			} else {
				this.modelBoiler[prop] = model[prop];
			};
		}
	}

	parseTemplate() {
		let props = [];

	}
}