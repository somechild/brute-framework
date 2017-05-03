"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _assertions = require("./assertions");

exports.default = {

	Assertions: _assertions.Assertions,
	ErrorCollector: _assertions.ErrorCollector,

	getSampleDesign() {
		return {
			"userInfo": {
				"collection": "UsersTest",
				"items": ["name", "username", "profileImage"],
				"uniqueByItem": "name",
				"useDynamicPattern": true,
				"endpoint": "user"
			},
			"footerContactInfo": {
				"collection": "GeneralInfoTest",
				"items": ["email", "phonenumber"],
				"uniqueByItem": "key",
				"matchPattern": "*"
			}
		};
	},
	getSampleSchema(itemName) {
		return itemName == "UsersTest" ? {
			"name": {
				type: "string"
			},
			"username": {
				type: "string"
			},
			"profileImage": {
				type: "string"
			}
		} : {
			"email": {
				type: "string",
				required: true,
				defaultValue: "asdf@asdf.ca"
			},
			"phonenumber": {
				type: "string"
			}
		};
	}
};