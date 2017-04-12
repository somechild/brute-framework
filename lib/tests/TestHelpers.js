"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	getSampleDesign() {
		return {
			"userInfo": {
				"collection": "Users",
				"items": ["name", "username", "profileImage"],
				"uniqueByItem": "name",
				"useDynamicPattern": true,
				"endpoint": "user"
			},
			"footerContactInfo": {
				"collection": "GeneralInfo",
				"items": ["email", "phonenumber"],
				"uniqueByItem": "key",
				"matchPattern": "*"
			}
		};
	}
};