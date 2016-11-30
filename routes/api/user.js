"use strict";

var express = require('express'),
    _ = require('underscore'),
    router = new express.Router(),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    async = require('async'),
    outline = require('./../utils/outline'),
    when = require('./../utils/when'),
    middleware = require('./../utils/middleware'),
    verify_data = require('./../utils/validation').user;

var db_user = require('./../database/user'),
    User = db_user.userSchema;

passport.serializeUser(function(user, done) {
    var createAccessToken = function () {
        var token = user.generateRandomToken();
        User.findOne( { accessToken: token }, function (err, existingUser) {
            if (err) { return done( err ); }
            if (existingUser) {
                createAccessToken(); // Run the function again - the token has to be unique!
            } else {
                user.set('accessToken', token);
                user.save( function (err) {
                    if (err) return done(err);
                    return done(null, user.get('accessToken'));
                })
            }
        });
    };

    if ( user._id ) {
        createAccessToken();
    }
});

passport.deserializeUser(function(token, done) {
    User.findOne( {accessToken: token } , function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(function(username, password, done) {
    User.findOne({ email: username }, function(err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: 'Unknown user ' + username });
        }
        user.comparePassword(password, function(err, isMatch) {
            if (err) return done(err);
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Invalid password' });
            }
        });
    });
}));

router.post('/register/new', [function(req, res, next) {
    next();
}].concat(function(req, res, next) {
    var data = verify_data(req.body);

    if (data.status != 'verified') {
        res.status(200);
        res.json({
            'status': 'warning',
            'response': data.data
        });
        return;
    }

    db_user.toRegisterNewUser_Function(data.data, { 'returnData': false }, function(result, response) {
        if (result == 'success') {
            passport.authenticate('local', function(err, user, info) {
                if (err) {
                    return next(err)
                }
                if (!user) {
                    return res.send({ status: 'error', message: "Invalid id or password" });
                } else {
                    req.logIn(user, function(err) {
                        if (err) {
                            return next(err);
                        }
                        return res.send({ status: 'success' });
                    });
                }
            })(req, res, next);
        } else {
            res.send({ 'status': result, 'response': response });
        }
    });
}));

router.post('/login', [function(req, res, next) {
    next();
}].concat(function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err)
        }
        if (!user) {
            return res.send({ status: 'error', message: "Invalid id or password" });
        } else {
            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }

                var data = {
                    name: user.name,
                    email: user.email,
                    phone: user.phone
                };

                return res.send({ status: 'success', accessToken: user.accessToken, info: data});
            });
        }
    })(req, res, next);
}));

router.get('/logout', [function(req, res, next) {
    next();
}].concat(function(req, res, next) {
    req.logOut();

    return res.send({status: 'success'});
}));

module.exports = router;
