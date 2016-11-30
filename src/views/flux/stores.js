var exports = {},
	storeactions = require('./storeconfig'),
	_ = require('underscore'),
	Fluxxor = require("fluxxor");

for (var i in storeactions) {
    var storeFns = storeactions[i];
	var store = _.extend({}, storeFns);
	store.initialize = getInitilaizeFn(i);
	exports[i] = Fluxxor.createStore(store);
}

function getInitilaizeFn(storeName) {
	var storeFns = storeactions[storeName];
	return function() {
		var bindArr = [];
		for (var j in storeFns) {
			if (j != 'getState') {
				bindArr.push(j, storeFns[j]);
			}
		}
		this.bindActions.apply(this, bindArr);
	}
}

module.exports = exports;
