"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Design = function () {
	function Design() {
		_classCallCheck(this, Design);
	}

	_createClass(Design, null, [{
		key: "validate",
		value: function validate(o) {}
	}]);

	return Design;
}();

var Pattern = function () {
	function Pattern() {
		_classCallCheck(this, Pattern);
	}

	_createClass(Pattern, [{
		key: "stringify",
		value: function stringify() {}
	}], [{
		key: "validate",
		value: function validate(o) {}
	}, {
		key: "parseResults",
		value: function parseResults(matchObj) {
			var result = matchObj.result,
			    originalQuery = matchObj.originalQuery;
			// TODO: ...
		}
	}]);

	return Pattern;
}();