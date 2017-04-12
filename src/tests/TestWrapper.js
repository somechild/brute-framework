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


	success() {
		if (isVerbose) {
			console.log('\x1b[32m', `${this.testpath}\n${this.testname} completed successfully.\n`);
		};
	}

	/**
	 * @message: returned result of failed test
	 */
	failed(message) {
		console.log('\x1b[31m', `${this.testpath}\n${this.testname} failed`);
		if (isVerbose) {
			console.log('\x1b[31m',' with result:\n');
			console.log('\x1b[31m',message);
			console.log('\n');
		};
	}
}