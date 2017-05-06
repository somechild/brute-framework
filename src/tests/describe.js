const _path_ = require('path');

/**
 * @param configs: both fields required: testName (string), testedFilePath (string) - path to file being tested
 * @return new TestCreationWrapper with testName and testedFilePath configured
 */
export default function describe(configs) {
	let { testName, testedFilePath } = configs;
	return new TestCreationWrapper(testName, testedFilePath);
}

class TestCreationWrapper {
	/**
	 * create wrapper with required testName and testedFilePath
	 * normalizes file path
	 * @param testName: string -  name of test set
	 * @param testedFilePath: string - path to file being tested (will be later noramlized)
	 * @throws Error if params invalid
	 */
	constructor(testName, testedFilePath) {
		if (typeof testName != "string" || typeof testName != typeof testedFilePath)
			throw new Error(`Invalid config {testName: ${testName}, testedFilePath: ${testedFilePath}}. Valid test name and tested file path must be provided in order to generate a test.`);
		this.name = testName;
		this.path = _path_.normalize(testedFilePath);
		this.tests = [];
	}

	/**
	 * adds test to wrapper
	 * @param testBody: function - body of test
	 * @throws Error if params invalid
	 */
	addTest(testBody) {
		if (typeof testBody != "function")
			throw new Error(`${testBody} is not a valid test. Tests must be functions.`);
		this.tests.push(testBody);
	};

	/**
	 * @return properly formatted array of tests to be tested by BatchRunner/TestWrapper classes in the index.js files
	 */
	finalize() {
		const { name, path } = this;
		return this.tests.map((body) => { return { name, path, body } });
	};
}