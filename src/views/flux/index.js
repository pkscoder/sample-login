var React = require("react"),
    Fluxxor = require("fluxxor"),
    FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin,
    stores = require('./stores'),
    actions = require('./actions');

module.exports = {
    getMixins: function(storeName) {
        var mixins = [FluxMixin, StoreWatchMixin(storeName), {
            getStateFromFlux: function() {
                return this.getFlux().store(storeName).getState;
            }
        }];
        return mixins;
    },
    initializeStore: function(storeName) {
        var store = {};
        store[storeName] = new stores[storeName]();
        storeActions = {};
        storeActions[storeName] = actions[storeName];
        return new Fluxxor.Flux(store, storeActions);
    }
};
