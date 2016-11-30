var exports = {},
    storeactions = require('./storeconfig');

for (var i in storeactions) {
    exports[i] = {};
    var storeObj = storeactions[i];
    for (var j in storeObj) {
        var action = j;
        if (action != 'getState') {
            exports[i][action] = (function(action) {
                return function() {
                    var args = Array.prototype.slice.call(arguments);
                    args.unshift(action);
                    this.dispatch.apply(this, args);
                }
            })(action);
        }
    }
}

module.exports = exports;
