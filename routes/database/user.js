var mongoose = require('./db_connect'),
    bcrypt = require('bcrypt-nodejs'),
    SALT_WORK_FACTOR = 10;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var userSchema = mongoose.Schema({
     name: { type: String },
     email: { type: String, required: true, unique: true },
     password: { type: String, required: true },
     phone: {type: String },
     accessToken: { type: String } 
});

// Bcrypt middleware
userSchema.pre('save', function(next) {
     var user = this;
     if(!user.isModified('password')) return next();

     bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
          if(err) return next(err);
          bcrypt.hash(user.password, salt, function() {

          }, function callback(err, hash) {
               if(err) return next(err);
               user.password = hash;
               next();
          });
     });
});

// Password verification
userSchema.methods.comparePassword = function(candidatePassword, cb) {
     bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
          if(err) return cb(err);
          cb(null, isMatch);
     });
};

// Remember Me implementation helper method
userSchema.methods.generateRandomToken = function () {
     var user = this,
          chars = "_!abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
          token = new Date().getTime() + '_';
     for ( var x = 0; x < 16; x++ ) {
          var i = Math.floor( Math.random() * 62 );
          token += chars.charAt( i );
     }
     return token;
};

// Seed a user
var User = mongoose.model('User', userSchema);

exports.toRegisterNewUser_Function = function(data, option, callback){
     var usr = new User(data);

     if(data.role.toLowerCase() == 'super_user'){
          User.findOne({ role: data.role }, function(err, user) {
               if(user === null){
                    usr.save(function(err, result){
                         if(err){
                              console.error(err)
                              if(err.code == 11000){
                                   callback('error', {'message': 'user has already registered with this email id'});
                              }else{
                                   callback('error', {'message': 'error while register new user'});
                              }
                         }else{
                              callback('success', {'message': 'register successful'});      
                         }          
                    });
               }else{
                    callback('error', {'message': 'register not allowed'});
               }
          });
     }else{
          usr.save(function(err, result){
               if(err){
                    console.error(err)
                    if(err.code == 11000){
                         callback('error', {'message': 'user has already registered with this email id'});
                    }else{
                         callback('error', {'message': 'error while register new user'});
                    }
               }else{
                    if(option.returnData){
                        callback('success', {'message': 'register successful', 'data': result});
                    }else{
                        callback('success', {'message': 'register successful', 'id': result._id});
                    }
               }          
          });
     }
}

exports.userSchema = User;