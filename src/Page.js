import { deepMatch, getSafe, getConfigs, weaveQuery } from 'utils';

const uuid = require('uuid');
const fs = require('fs');

class Page {
	constructor(data, pattern, containerId) {
		this.context = data;
		this.pattern = pattern;
		this.pageContainer = containerId;
		this.contextHasChanged = true;

		this._id = uuid();

		// create file
	}

	recomputeData(data) {
		if (data == this.context || deepMatch(data, this.context))
			return data;
		this.context = data;
		this.contextHasChanged = true;
	}

	getId() {
		return this._id;
	}

	getContainerId() {
		return this.pageContainer;
	}

	getFile() {
		let filePath = getSafe(getConfigs(), 'general.pageStorePath');
		if (!filePath) throw new Error('page store directory has not been configured');
		filePath += this.getId() + ".html";
		if (this.contextHasChanged || fs.existsSync(filePath)) {
			let template = weaveQuery('PageContainer', this.getContainerId()).getTemplate();
			// load in data to filePath using cheerio
			// write file
			this.contextHasChanged = false;
		};

		return filePath;
	}
}