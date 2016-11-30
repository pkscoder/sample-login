var Services = require('./../../services'),
    cookie = require('react-cookie');

function getFreshState() {
    return {
        'userProfile': '',
    };
}

var state = getFreshState();

module.exports = {
    getState: state,

    submitLogin: function(obj) {
        var _self = this;

        Services.users.login(obj, function(err, result) {
            if (err || result.status == 'error') {
                return alert("Invalid id or password");
            }

            cookie.save('accessToken', result.accessToken);
            cookie.save('info', result.info);
            _self.emit('change');
        });
    },

    submitLogout: function() {
        var _self = this;

        Services.users.logout(function(err, result) {
            if (err || result.status == 'error') {
                return alert("Something went wrong");
            }

            cookie.remove('accessToken');
            cookie.remove('info');
            _self.emit('change');
        });
    }
};
