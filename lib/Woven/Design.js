'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../helpers/utils');

var _constants = require('../helpers/constants');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var uuid = require('uuid');

var Design = function () {
	_createClass(Design, null, [{
		key: 'getRequiredItems',


		/*****--- change these as framework evolves ---*****/

		value: function getRequiredItems() {
			return {
				requiredProps: ["collection", "items"], // generally required

				dynamicRequiredProps: ["endpoint"], // for dynamic fields (defined by route queries)
				staticRequiredProps: ["matchPattern"] };
		}

		/*****--- ---*****/

		/**
   * @param design: user-configured design
   * @throws Error if invalid design layout
   * @throws Error if unexpected error initializing page with unique id
   */

	}]);

	function Design(design) {
		_classCallCheck(this, Design);

		this.layout = design;

		this._id = uuid();
		var insertionAttempts = _constants.maxWovenInsertionAttempts;
		while (!_utils.Weaver.insert(this) && insertionAttempts-- > 0) {
			this._id = uuid();
		}if (!insertionAttempts) throw new Error('Unexpected error initializing ${this.constructor.name} class with design ${design}');
	}

	_createClass(Design, [{
		key: 'layout',
		get: function get() {
			return this.design;
		},


		/**
   * @param newDesign: new design to set
   * @throws error if invalid design layout & reverts to old layout
   * @return old layout
   */
		set: function set(newDesign) {
			var old = this.design;
			this.design = newDesign;

			if (!Design.validate(this)) {
				this.design = old;
				throw new Error(`Invalid design layout: ${newDesign}`);
			}

			// update all the undefined uniqueByItems to conform to associated collection's configurations
			for (var prop in newDesign) {
				var descriptionItem = newDesign[prop];
				if (typeof descriptionItem.uniqueByItem == "undefined") {
					var uniqueBy = _utils.Collector.getQuerier().with(descriptionItem.collection).getContext().indexingProp; // should not throw error as we just validated existence of associated Collection instance in 'Design.validate(this)''
					newDesign[prop].uniqueByItem = uniqueBy;
				}
			}

			this.design = newDesign; // update design with the newly filled 'uniqueByItem' fields
			return old;
		}

		/**
   * validate an object to see if it is a proper design class with a valid layout
   * @param o: any variable to check
   * @return true if valid
   */

	}, {
		key: 'id',
		get: function get() {
			return this._id;
		}
	}], [{
		key: 'validate',
		value: function validate(o) {
			if (!(o instanceof Design)) return false;

			var layout = o.layout;
			if (!layout || typeof layout != "object" || Array.isArray(layout)) return false;

			var _getRequiredItems = this.getRequiredItems(),
			    requiredProps = _getRequiredItems.requiredProps,
			    dynamicRequiredProps = _getRequiredItems.dynamicRequiredProps,
			    staticRequiredProps = _getRequiredItems.staticRequiredProps;

			for (var prop in layout) {
				var descriptionItem = layout[prop];
				if (!descriptionItem || typeof descriptionItem != "object" || Array.isArray(descriptionItem)) return false;
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = requiredProps[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var requiredProp = _step.value;

						if (!(requiredProp in descriptionItem)) return false;
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}

				if (descriptionItem.useDynamicPattern) {
					var _iteratorNormalCompletion2 = true;
					var _didIteratorError2 = false;
					var _iteratorError2 = undefined;

					try {
						for (var _iterator2 = dynamicRequiredProps[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							var _requiredProp = _step2.value;

							if (!(_requiredProp in descriptionItem)) return false;
						}
					} catch (err) {
						_didIteratorError2 = true;
						_iteratorError2 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion2 && _iterator2.return) {
								_iterator2.return();
							}
						} finally {
							if (_didIteratorError2) {
								throw _iteratorError2;
							}
						}
					}
				} else {
					var _iteratorNormalCompletion3 = true;
					var _didIteratorError3 = false;
					var _iteratorError3 = undefined;

					try {
						for (var _iterator3 = staticRequiredProps[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
							var _requiredProp2 = _step3.value;

							if (!(_requiredProp2 in descriptionItem)) return false;
						}
					} catch (err) {
						_didIteratorError3 = true;
						_iteratorError3 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion3 && _iterator3.return) {
								_iterator3.return();
							}
						} finally {
							if (_didIteratorError3) {
								throw _iteratorError3;
							}
						}
					}
				};

				var CollectionExists = true;
				var collectionItem = _utils.Collector.getQuerier();
				try {
					collectionItem.with(descriptionItem.collection); // throws error if collection with name in param does not exist
				} catch (e) {
					CollectionExists = false;
				}
				if (!CollectionExists) {
					return console.log(`${descriptionItem.collection} is not a defined collection.`) && false;
				} else {
					collectionItem = collectionItem.getContext(); // get the actual collection instance
				};

				var uniqueBy = collectionItem.indexingProp;
				if (typeof descriptionItem.uniqueByItem != "undefined" && descriptionItem.uniqueByItem != uniqueBy) {
					return console.log(`Invalid 'uniqueByItem' property value: ${descriptionItem.uniqueByItem}. The collection ${descriptionItem.collection}'s unique property is already set to ${uniqueBy}. Your design's 'uniqueByItem' property value should match.`) && false;
				};
			}

			return true;
		}
	}]);

	return Design;
}();

exports.default = Design;