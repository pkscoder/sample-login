"use strict";
var _ = require('underscore');

var async = require('async');

// converts an async function into a pseudo promise, returning a .then that will be called with err, res
// the nice thing here is your callback will be called even if you add it after the function has finished 

function when(fn) {
    if (!(this instanceof when)) {
        return new when(fn);
    }
    var t = this;
    this.listeners = [];
    this.done = false;

    this.then = _.bind(this.then, this);

    fn(function(err, res) {
        t.err = err;
        t.res = res;
        t.done = true;
        t.then();
    });
}

_.extend(when.prototype, {
    then: function(fn) {
        var t = this;
        fn && this.listeners.push(fn);
        if (this.done) {
            _(this.listeners).each(function(l) {
                l(t.err, t.res);
            });
            this.listeners = [];
        }
    },

    destroy: function() {
        var t = this;
        t.err = t.res = t.done = t.then = t.destroy = t.listeners = null; //whatever
    }
});


// and here's a generic api for using it in the context of an object

function api(scope) {
    if (scope.__when && scope.__when instanceof api) {
        return scope.__when;
    }

    if (!(this instanceof api)) {
        return new api(scope);
    }
    this.scope = scope;
    scope.__when = this;
    this.all = _.bind(this.all, this);
}

_.extend(api.prototype, {
    add: function(name, fn) {
        if (this[name]) {
            throw new Error('will not override a promise! bad things will happen! :' + name);
        }

        this[name] = when(fn);
        return this;
    },
    destroy: function() {
        _(this).each(function(w) {
            (w instanceof when) && w.destroy();
        });
        this.scope = null;
    },
    all: function(fn) {
        // execute a handler when all of the attached resolve.
        async.parallel(_(this).chain().map(function(v, n) {
            if (v instanceof when) {
                return v.then;
            } else {
                return undefined;
            }
        }).without(undefined).value(), fn);
    }
});

api.when = when; // export the primitive function as well

module.exports = api;
