'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require('fs');
var uuid = require('uuid');

var Route = function () {
	/**
  * create route with unique id, unique user-defined name
  * @param design: instance of Design specifying format of object used by the route's template
  * @param config: Object with templatePath prop to specify path to template associated with route & name prop to associate unique name with this route
  */
	function Route(design, config) {
		_classCallCheck(this, Route);

		var templatePath = config.templatePath,
		    name = config.name;


		this.name = name;
		this._id = uuid();

		var model = new DataModel(design, this);
		var pageContainer = new PageContainer(templatePath);

		this.model = model.id;
		this.pageContainer = pageContainer.id;
	}

	_createClass(Route, [{
		key: 'updateTemplate',


		/**
   * update template path
   * @param {optional} newPath: String -- path to new template
   * 		--> {defualt} refresh cached template
   */
		value: function updateTemplate(newPath) {
			var pageCont = (0, _utils.weaveQuery)('PageContainer', this.pageContainer);
			if (!newPath) {
				newPath = pageCont.getTemplatePath();
			}
			pageCont.setTemplate(newPath);
		}

		/**
   * @return DataModel instance - model associated with route
   */

	}, {
		key: 'getFileWithPattern',


		/**
   * get HTML file based on Pattern instance
   * @param pattern instance to match file against
   * @return path to file matching pattern
   */
		value: function getFileWithPattern(pattern) {
			// TODO
		}
	}, {
		key: 'id',
		get: function get() {
			return this._id;
		}
	}, {
		key: 'name',
		get: function get() {
			return this.name;
		}
	}, {
		key: 'model',
		get: function get() {
			return this.model;
		}
	}]);

	return Route;
}();