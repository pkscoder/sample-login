var request = require('superagent'),
    Promise = require('es6-promise').Promise;

module.exports = {
    login: function(data, callback) {
        return new Promise(function(resolve, reject) {
            request.post('/user/login')
                .send(JSON.stringify(data))
                .set('Content-Type', 'application/json')
                .end(function(err, result) {
                    if (err) {
                        callback && callback(err);
                        reject(err);
                    } else {
                        var userProfileInfo = result.body || {};
                        callback && callback(null, userProfileInfo);
                        resolve(userProfileInfo);
                    }
                })
        });
    },

    logout: function(callback) {
        return new Promise(function(resolve, reject) {
            request.get('/user/logout').end(function(err, result) {
                if (err) {
                    callback && callback(err, null);
                    reject(err);
                } else {
                    var response = result.body || {};
                    callback && callback(null, response);
                    resolve(response);
                }
            });
        });
    }
};
