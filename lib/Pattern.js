"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pattern = function () {
	function Pattern(pattern) {
		_classCallCheck(this, Pattern);

		this.pattern = pattern;
		if (!this.validate(this)) throw new Error(`Invalid pattern: ${pattern}`);
	}

	_createClass(Pattern, [{
		key: "stringify",
		value: function stringify() {
			var o = "";
			var sortedProps = Object.keys(this.pattern).sort();
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = sortedProps[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var _prop = _step.value;

					o += `${_prop}:${this.pattern[_prop]}`;
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			return o;
		}
	}, {
		key: "breakdown",
		get: function get() {
			return this.pattern;
		},
		set: function set(newPattern) {
			var old = this.pattern;
			this.pattern = newPattern;
			if (!this.validate(this)) {
				this.pattern = old;
				throw new Error(`Invalid pattern: ${pattern}`);
			};
			return old;
		}
	}], [{
		key: "validate",
		value: function validate(o) {
			if (!(o instanceof Pattern)) return false;
			var breakdown = o.breakdown;
			if (typeof breakdown != "object" || Array.isArray(breakdown)) return false;
			for (prop in breakdown) {
				if (typeof breakdown[prop] != "string") return false;
			}
			return true;
		}
	}, {
		key: "parseResults",
		value: function parseResults(matchObj) {
			var matches = matchObj.matches,
			    originalQuery = matchObj.originalQuery;
			// TODO: ... muder me ...
		}
	}]);

	return Pattern;
}();