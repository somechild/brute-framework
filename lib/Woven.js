'use strict';

var _Collection = require('./Woven/Collection');

var _Collection2 = _interopRequireDefault(_Collection);

var _DataModel = require('./Woven/DataModel');

var _DataModel2 = _interopRequireDefault(_DataModel);

var _Design = require('./Woven/Design');

var _Design2 = _interopRequireDefault(_Design);

var _Page = require('./Woven/Page');

var _Page2 = _interopRequireDefault(_Page);

var _PageContainer = require('./Woven/PageContainer');

var _PageContainer2 = _interopRequireDefault(_PageContainer);

var _Pattern = require('./Woven/Pattern');

var _Pattern2 = _interopRequireDefault(_Pattern);

var _Route = require('./Woven/Route');

var _Route2 = _interopRequireDefault(_Route);

var _utils = require('./helpers/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_utils.Weaver.initializeSpace(['Collection', 'DataModel', 'Design', 'Page', 'PageContainer', 'Pattern', 'Route']);

_utils.Collector.initializeSpace();

module.exports = {
	Collection: _Collection2.default,
	DataModel: _DataModel2.default,
	Design: _Design2.default,
	Page: _Page2.default,
	PageContainer: _PageContainer2.default,
	Pattern: _Pattern2.default,
	Route: _Route2.default
};