"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Collection = function () {
	function Collection(name, schema, indexByProp) {
		_classCallCheck(this, Collection);
	}

	_createClass(Collection, [{
		key: "getId",
		value: function getId() {}
	}, {
		key: "updateSchema",
		value: function updateSchema() {}
	}, {
		key: "get",
		value: function get(entryIdx) {}
	}, {
		key: "findOne",
		value: function findOne(matchObj) {}
	}, {
		key: "findAll",
		value: function findAll() {}
	}, {
		key: "insert",
		value: function insert(o) {}
	}, {
		key: "remove",
		value: function remove(entryIdx) {}
	}]);

	return Collection;
}();

var CollectionEntry = function () {
	function CollectionEntry(data, parentCollection) {
		_classCallCheck(this, CollectionEntry);
	}

	_createClass(CollectionEntry, [{
		key: "data",
		value: function data() {}
	}, {
		key: "parent",
		value: function parent() {}
	}, {
		key: "getId",
		value: function getId() {}
	}]);

	return CollectionEntry;
}();