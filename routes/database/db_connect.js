var mongoose = require('mongoose'),
    conf = require('config').database;

if (conf.use_url) {
    mongoose.connect(conf.url);
} else {
    if (!conf.auth) {
        if (conf.port == null) {
            mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://' + conf.host + '/' + conf.db);
        } else {
            mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://' + conf.host + ':' + conf.port + '/' + conf.db);
        }
    } else {
        if (conf.port == null) {
            mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://' + conf.username + ':' + conf.password + '@' + conf.host + '/' + conf.db);
        } else {
            mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://' + conf.username + ':' + conf.password + '@' + conf.host + ':' + conf.port + '/' + conf.db);
        }
    }
}

module.exports = mongoose;
