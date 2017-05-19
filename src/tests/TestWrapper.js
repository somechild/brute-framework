export default class TestWrapper {
	/**
	 * @param test: object containing:
	 * 				> body: function - method to run the test
	 * 				> path: string - test sub-directory-path to the test
	 * 				> name: string - name of test
	 * @param isVerbose: true for a verbose console report
	 */
	constructor(test, isVerbose) {
		this.main = test.body;
		this.testpath = test.path;
		this.testname = test.name;
		this.isVerbose = isVerbose;
	}

	static relativepath() {
		return '../';
	}

	/**
	 * @param testedItemName: name of item tested
	 */
	success(testedItemName) {
		if (this.isVerbose) {
			console.log('\x1b[32m', `${this.testpath}\n${this.testname} for ${testedItemName} completed successfully.`);
			console.log('\x1b[0m', '\n');
		};
	}

	/**
	 * @param testedItemName: name of item tested
	 * @param message: returned message of failed test
	 */
	failed(testedItemName, message) {
		console.log('\x1b[31m', `${this.testpath}\n${this.testname} for ${testedItemName} failed`);
		if (this.isVerbose) {
			console.log('\x1b[31m',' with message:\n');
			console.log('\x1b[31m', message);
		};
		console.log('\x1b[0m', '\n');
	}
}