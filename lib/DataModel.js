'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var uuid = require('uuid');

var DataModel = function () {
	/**
  * @param design: the design of the object that the route's template needs to parse handlebars
  * @param route: route that this DataModel is associated with
  */
	function DataModel(design, route) {
		_classCallCheck(this, DataModel);

		this._id = uuid();

		if (route instanceof Route) {
			this.route = route.id;
		};

		this.setDesign(design);
	}

	_createClass(DataModel, [{
		key: 'setDesign',


		/**
   * @param newDesign: set a new design for the datamodel
   * @return old design
   */
		value: function setDesign(newDesign) {
			if (!Design.validate(design)) throw new Error("Invalid design structure");
			var old = this.design;
			this.design = design;
			return old;
		}

		/** 
   * @param newRoute: associated datamodel with a new route (route must already have this DataModel set as its model)
   * @return old routeId
   */

	}, {
		key: 'setRoute',
		value: function setRoute(newRoute) {
			if (newRoute instanceof Route && newRoute.getModel() === this.id) {
				var old = this.route;
				this.route = newRoute.id;
				return old;
			} else {
				throw new Error(`Route object is invalid, or does not point to this model already.`);
			};
		}

		/**
   * @param pattern: a valid Pattern for matching the dynamic properties of the model to collection data
   * @return an object instance formatted as per this model's 'design' & containing values matching pattern from latest Collection documents
   */

	}, {
		key: 'getDataInstance',
		value: function getDataInstance(pattern) {
			if (!Pattern.validate(pattern)) throw new Error(`Invalid pattern ${pattern}`);

			var o = {};
			var design = this.design.layout;
			var querier = new _utils.CollectionQuerier();

			for (sectionName in design) {
				var section = design[sectionName];
				var query = {};
				query[section.uniqueByItem] = section.matchPattern || pattern.breakdown[section.endpoint];
				var matches = querier.with(section.collection).find(query);
				if (!matches) throw new Error(`No matches found for pattern ${pattern}`);
				//TODO:
				// fix parsing to process required 'items' in section
				// returns object
				o[sectionName] = Pattern.parseResults({
					matches,
					originalExpression: query[section.uniqueByItem],
					items: section.items
				});
			}
			return o;
		}
	}, {
		key: 'id',
		get: function get() {
			return this._id;
		}
	}]);

	return DataModel;
}();