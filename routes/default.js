"use strict";

var express = require('express'),
    _ = require('underscore'),
    router = new express.Router(),
    async = require('async'),
    outline = require('./utils/outline'),
    when = require('./utils/when'),
    middleware = require('./utils/middleware');

router.get('/', 
    [function(req, res, next) {
        next();
    }].concat(middleware).concat(function(req, res, next) {
        var w = when(req);

        async.parallel([
            w.all
        ], function(err, resArr) {
            outline(req).scripts('/javascripts/app-combined.js');
            outline(req).stylesheets('/stylesheets/app.css');
            res.content();
            w.destroy();
        });
    })
);

module.exports = router;