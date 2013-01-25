var UserService = (function() {
  return {
    initialize: function(dependencies, fn) {
      var self = this;

      self.mongoose = dependencies['mongoose'];
      self.db = self.mongoose.createConnection('127.0.0.1', 'nodeBlog');

      self.db.on('error', function() {
        fn('Error connecting to database');
      });
      
      self.db.once('open', function dbOpenCallback() {
        var userSchema = new self.mongoose.Schema({
          username: String,
          password: String,
          displayName: String
        });

        userSchema.methods.validPassword = function (password) {
          return this.password === password;
        };

        self.User = self.db.model('User', userSchema);

        if (fn && typeof(fn) === 'function') {  
          fn();  
        }
      });
    },
    addUser: function(user, fn) {
      var userToSave = new this.User(user);

      userToSave.save(function addUserCallback(err) {
        if (fn && typeof(fn) === 'function') {  
          fn(err);  
        }
      });
    },
    getById: function(id, fn) {
      this.User.findOne({_id: id}, function(err, user) {
        if (fn && typeof(fn) === 'function') {  
          fn(err, user);  
        }
      }); 
    },
    getByUsername: function(username, fn) {
      this.User.findOne({username: username}, function(err, user) {
        if (fn && typeof(fn) === 'function') {  
          fn(err, user);  
        }
      }); 
    },
    removeAll: function(fn) {
      this.User.remove({}, function removeAllCallback(err) {
        if (fn && typeof(fn) === 'function') {  
          fn(err);
        }
      });
    }
  }
}());

module.exports = UserService;