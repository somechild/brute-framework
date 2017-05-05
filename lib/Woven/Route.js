'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../helpers/utils');

var _constants = require('../helpers/constants');

var _DataModel = require('./DataModel');

var _DataModel2 = _interopRequireDefault(_DataModel);

var _PageContainer = require('./PageContainer');

var _PageContainer2 = _interopRequireDefault(_PageContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require('fs');
var uuid = require('uuid');

var Route = function () {
	/**
  * create route with unique id, unique user-defined name
  * @param design: instance of Design specifying format of object used by the route's template
  * @param config: Object with templatePath prop to specify path to template associated with route & name prop to associate unique name with this route
  * @throws Error if unexpected error initializing page with unique id
  */
	function Route(design, config) {
		_classCallCheck(this, Route);

		var templatePath = config.templatePath,
		    name = config.name;


		this.$name = name;
		this._id = uuid();

		var insertionAttempts = _constants.maxWovenInsertionAttempts;
		while (!_utils.Weaver.insert(this) && insertionAttempts-- > 0) {
			this._id = uuid();
		}if (!insertionAttempts) throw new Error(`Unexpected error initializing ${this.constructor.name} class with route name ${name}`);

		var model = new _DataModel2.default(design, this);
		var pageContainer = new _PageContainer2.default(templatePath);

		this.modelId = model.id;
		this.pageContainerId = pageContainer.id;
	}

	_createClass(Route, [{
		key: 'updateTemplate',


		/**
   * update template path
   * @param {optional} newPath: String -- path to new template
   * 		--> {defualt} refresh cached template
   */
		value: function updateTemplate(newPath) {
			var pageContainer = this.pageContainer;
			if (!newPath) {
				newPath = pageContainer.getTemplatePath();
			}
			pageContainer.setTemplate(newPath);
		}

		/**
   * @return DataModel instance - model associated with route
   */

	}, {
		key: 'getFileWithPattern',


		/**
   * get HTML file based on Pattern instance
   * @param pattern instance to match file against
   * @throws Error if pattern is invalid
   * @return path to file matching pattern
   */
		value: function getFileWithPattern(pattern) {
			if (!Pattern.validate(pattern)) throw new Error(`Invalid pattern ${pattern}`);
			var model = this.model;
			var pageContainer = this.pageContainer;

			var data = model.getDataInstance(pattern);
			var page = pageContainer.getPageWithData(pattern, data);

			return page.getFile();
		}
	}, {
		key: 'id',
		get: function get() {
			return this._id;
		}
	}, {
		key: 'name',
		get: function get() {
			return this.$name;
		}
	}, {
		key: 'model',
		get: function get() {
			return _utils.Weaver.query('DataModel', this.modelId);
		}

		/**
   * @return PageContainer instance - container associated with route
   */

	}, {
		key: 'pageContainer',
		get: function get() {
			return _utils.Weaver.query('PageContainer', this.pageContainerId);
		}
	}]);

	return Route;
}();

exports.default = Route;