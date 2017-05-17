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

var _Pattern = require('./Pattern');

var _Pattern2 = _interopRequireDefault(_Pattern);

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

		if (route instanceof _Route2.default) {
			this.$routeId = route.id;
		};

		this.design = design;

		this._id = uuid();
		var insertionAttempts = _constants.maxWovenInsertionAttempts;
		while (!_utils.Weaver.insert(this) && insertionAttempts-- > 0) {
			this._id = uuid();
		}if (!insertionAttempts) throw new Error('Unexpected error initializing ${this.constructor.name} class with model design ${desgin}');
	}

	_createClass(DataModel, [{
		key: 'getDataInstance',


		/**
   * @param pattern: a valid Pattern for matching the dynamic properties of the model to collection data
   * @return an object instance formatted as per this model's 'design' & containing values matching pattern from latest Collection documents
   */
		value: function getDataInstance(pattern) {
			if (!_Pattern2.default.validate(pattern)) throw new Error(`Invalid pattern ${pattern}`);

			var toReturn = {};
			var design = this.design.layout;
			var querier = _utils.Collector.getQuerier();

			var hasSomeResults = void 0;
			for (var sectionName in design) {
				var section = design[sectionName];

				var query = {};
				query[section.uniqueByItem] = section.matchPattern || pattern.breakdown[section.endpoint];

				var matches = querier.with(section.collection).find(query);
				if (!matches || !matches.length) continue;
				matches = (0, _utils.unwrap)(matches);

				hasSomeResults = true;

				toReturn[sectionName] = (0, _utils.parseResults)({
					matches,
					originalExpression: query[section.uniqueByItem],
					items: section.items
				});
			}
			return hasSomeResults && toReturn;
		}
	}, {
		key: 'id',
		get: function get() {
			return this._id;
		}

		/**
   * @param newDesign: set a new design for the datamodel
   * @return old design
   */

	}, {
		key: 'design',
		set: function set(newDesign) {
			if (!_Design2.default.validate(newDesign)) throw new Error("Invalid design structure");
			var old = this.design;
			this.$designId = newDesign.id;
			return old;
		},
		get: function get() {
			return _utils.Weaver.query('Design', this.$designId);
		}

		/** 
   * @param newRoute: associated datamodel with a new route (route must already have this DataModel set as its model)
   * @return old routeId
   */

	}, {
		key: 'route',
		set: function set(newRoute) {
			if (newRoute instanceof _Route2.default && newRoute.model === this) {
				var old = this.route;
				this.$routeId = newRoute.id;
				return old;
			} else {
				throw new Error(`Route object is invalid, or does not point to this model already.`);
			};
		},
		get: function get() {
			return _utils.Weaver.query('Route', this.$routeId);
		}
	}]);

	return DataModel;
}();

exports.default = DataModel;