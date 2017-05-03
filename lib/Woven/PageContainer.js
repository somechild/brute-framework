'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../helpers/utils');

var _constants = require('../helpers/constants');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var uuid = require('uuid');
var fs = require('fs');
var _path_ = require('path');

var PageContainer = function () {
	/**
  * assign unique ID & initalize Page container as a map
  * @param templatePath: String - path to template associated with this container
  * @throws Error if there is no template at specified templatePath
  * @throws Error if unexpected error initializing page with unique id
  */
	function PageContainer(templatePath) {
		_classCallCheck(this, PageContainer);

		this._id = uuid();

		var insertionAttempts = _constants.maxWovenInsertionAttempts;
		while (!_utils.Weaver.insert(this) && insertionAttempts-- > 0) {
			this._id = uuid();
		}if (!insertionAttempts) throw new Error('Unexpected error initializing ${this.constructor.name} class with template path ${templatePath}');

		this.pages = new Map();

		if (typeof templatePath == "string") this.setTemplate(templatePath);
	}

	/**
  * set template path
  * @param path: String -- path to template 
  * @throws Error if there is no file at specified path
  * @throws if file is invalid template format
  * @throws fs error if trouble reading file through node's fs
  * @return old path
  */


	_createClass(PageContainer, [{
		key: 'setTemplate',
		value: function setTemplate(path) {
			path = _path_.normalize(path);
			if (!fs.existsSync(path)) throw new Error(`File does not exist at ${path}`);
			if (!_utils.TemplateProcessor.validateTemplate(fs.readFileSync(path, 'utf-8'))) throw new Error(`File at path ${path} is an invalid template format`);
			var old = this.templatePath;
			this.templatePath = path;
			return old;
		}

		/**
   * @param pattern - Pattern object instance
   * @return Page object matching specified pattern
   */

	}, {
		key: 'getPage',
		value: function getPage(pattern) {
			return this.pages.get(pattern.stringify());
		}

		/**
   * if page does not exist, it will be created
   * @param pattern - Pattern object instance
   * @param data - data generated by a DataModel
   * @return Page object with data updated to @data param
   */

	}, {
		key: 'getPageWithData',
		value: function getPageWithData(pattern, data) {
			var page = this.pages.get(pattern.stringify());
			if (!page) return this.createPage(data, pattern);
			page.recomputeData(data);
			return page;
		}

		/**
   * create page and add to this container's map
   * @param data - data generated by a DataModel
   * @param pattern - Pattern object instance
   * @return created Page instance
   */

	}, {
		key: 'createPage',
		value: function createPage(data, pattern) {
			var page = new Page(data, pattern, this._id);
			this.pages.set(pattern.stringify(), page);
			return page;
		}

		/**
   * @return string of template associated with this container
   */

	}, {
		key: 'getTemplate',
		value: function getTemplate() {
			var returner = void 0;
			try {
				returner = fs.readFileSync(this.getTemplatePath(), 'utf-8');
			} catch (e) {
				console.log(e.stack);
				console.log(e.message);
				returner = _utils.DefaultTemplates.hasError();
			} finally {
				return returner;
			}
		}

		/**
   * @return path to template associated with this container
   */

	}, {
		key: 'getTemplatePath',
		value: function getTemplatePath() {
			return this.templatePath;
		}
	}, {
		key: 'id',
		get: function get() {
			return this._id;
		}
	}]);

	return PageContainer;
}();

exports.default = PageContainer;