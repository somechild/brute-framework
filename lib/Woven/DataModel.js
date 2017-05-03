'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../helpers/utils');

var _constants = require('../helpers/constants');

var _Design = require('./Design');

var _Design2 = _interopRequireDefault(_Design);

var _Route = require('./Route');

var _Route2 = _interopRequireDefault(_Route);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var uuid = require('uuid');

var DataModel = function () {
	/**
  * @param design: the design of the object that the route's template needs to parse handlebars
  * @param route: route that this DataModel is associated with
  * @throws Error if unexpected error initializing page with unique id
  */
	function DataModel(design, route) {
		_classCallCheck(this, DataModel);

		this._id = uuid();
		var insertionAttempts = _constants.maxWovenInsertionAttempts;
		while (!_utils.Weaver.insert(this) && insertionAttempts-- > 0) {
			this._id = uuid();
		}if (!insertionAttempts) throw new Error('Unexpected error initializing ${this.constructor.name} class with model design ${desgin}');

		if (route instanceof _Route2.default) {
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
			if (!_Design2.default.validate(newDesign)) throw new Error("Invalid design structure");
			var old = this.design;
			this.design = newDesign;
			return old;
		}

		/** 
   * @param newRoute: associated datamodel with a new route (route must already have this DataModel set as its model)
   * @return old routeId
   */

	}, {
		key: 'setRoute',
		value: function setRoute(newRoute) {
			if (newRoute instanceof _Route2.default && newRoute.getModel() === this.id) {
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
			var querier = _utils.Collector.getQuerier();

			for (var sectionName in design) {
				var section = design[sectionName];
				var query = {};
				query[section.uniqueByItem] = section.matchPattern || pattern.breakdown[section.endpoint];
				var matches = querier.with(section.collection).find(query);
				if (!matches) throw new Error(`No matches found for pattern ${pattern}`);

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

exports.default = DataModel;