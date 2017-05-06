export default {
	getSampleDesign() {
		return {
			"userInfo": {
				"collection": "UsersTest",
				"uniqueByItem": "name", // optional (mainly here for reference purposes) should be the unique indexing prop defined in associated Collection
				"items": ["name", "username", "profileImage"],
				"useDynamicPattern": true,
				"endpoint": "user",
			},
			"footerContactInfo": {
				"collection": "GeneralInfoTest",
				"uniqueByItem": "key", // should be the unique indexing prop defined in associated Collection
				"items": ["email", "phonenumber"],
				"matchPattern": "*",
			}
		};
	},
	getSampleSchema(itemName) {
		return itemName == "UsersTest" ? {
			"name": {
				type: "string",
			},
			"username": {
				type: "string",
			},
			"profileImage": {
				type: "string",
			}
		} : {
			"email": {
				type: "string",
				required: true,
				defaultValue: "asdf@asdf.ca",
			},
			"phonenumber": {
				type: "string",
			},
			"key": {
				type: "number",
				required: true,
			}
		};
	},
	getSamplePattern() { // conforming to sample design
		return {
			"user": "John", // sample design defines 'user' endpoint to match with 'name' field (uniqueByItem)
		}
	},
};