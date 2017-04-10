import Collection from './Woven/Collection';
import DataModel from './Woven/DataModel';
import Design from './Woven/Design';
import Page from './Woven/Page';
import PageContainer from './Woven/PageContainer';
import Pattern from './Woven/Pattern';
import Route from './Woven/Route';

import { Collector, Weaver } from './helpers/utils';
Weaver.initializeSpace([
	'Collection',
	'DataModel',
	'Design',
	'Page',
	'PageContainer',
	'Pattern',
	'Route'
]);

Collector.initializeSpace();

module.exports = {
	Collection,
	DataModel,
	Design,
	Page,
	PageContainer,
	Pattern,
	Route,
};