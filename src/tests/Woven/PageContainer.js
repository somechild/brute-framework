import PageContainer from '../../Woven/PageContainer';
import Page from  '../../Woven/Page';
import describe from '../describe';

//aux
import { Assertions, ErrorCollector } from '../assertions';
import TestHelpers from '../TestHelpers';
import { Weaver } from '../../helpers/utils';

// create test
const PageContainerTest = describe({
	testName: 'PageContainer class tests', 
	testedFilePath: (__dirname + '../../Woven/PageContainer'),
});

PageContainerTest.addTest(function() {
	let assert = new Assertions();
	let errorCollector = new ErrorCollector();
	assert.collectErrors(errorCollector);



	// constructor tests
	{

	}

	// getPage, getPageWithData and createPage tests
	{

	}

	return errorCollector.finalize({testedItemName: 'PageContainer class'});
});

export default PageContainerTest.finalize();