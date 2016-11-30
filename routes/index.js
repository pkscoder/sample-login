"use strict";
var _ = require('underscore');

// Attach routes here
module.exports = function(app) {
    app.use('/user', require('./api/user').middleware);
    app.use('/', require('./default').middleware);
};
