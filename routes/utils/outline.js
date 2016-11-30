"use strict";

var _ = require('underscore');

function outline(scope) {
    if (scope.__outline && scope.__outline instanceof outline) {
        return scope.__outline;
    }
    if (!(this instanceof outline)) {
        return new outline(scope);
    }
    this.scope = scope;
    scope.__outline = this;
    this._scripts = [];
    this._stylesheets = [];
    this._pump = {};
}

_.extend(outline.prototype, {
    scripts: function(src) {
        var t = this;
        if (src) {
            this._scripts = _(this._scripts.concat(src)).uniq();
            return this;
        } else {
            return {
                src: this._scripts,
                toString: function(async) {
                    return _(t._scripts || []).map(function(s) {
                        return '<scri' + 'pt src="' + s + '"' + (async ? ' async defer' : '') + '></scri' + 'pt>';
                    }).join('');
                }
            };
        }
    },
    stylesheets: function(src) {
        var t = this;
        if (src) {
            this._stylesheets = _(this._stylesheets.concat(src)).uniq();
            return this;
        } else {
            return {
                src: this._stylesheets,
                toString: function() {
                    return _(t._stylesheets || []).map(function(s) {
                        return '<li' + 'nk href="' + s + '" rel="stylesheet"/>';
                    }).join('');
                }
            };
        }
    },
    pump: function(key, val) {
        var t = this;
        if (key) {
            if (this._pump[key]) {
                // console.warn('outline: overwriting', key);
            }
            this._pump[key] = val;
            return this;
        } else {
            return {
                data: this._pump,
                toString: function() {
                    return '<scri' + 'pt>' + _(t._pump || []).map(function(v, k) {
                        return 'window["__pri_' + k + '__"]=' + (JSON.stringify(v) || '').replace(/</g, '&lt;'); // sanitize against xss attacks, whatnot.
                    }).join(';') + '</scri' + 'pt>';
                }
            };
        }
    }
});

module.exports = outline;
