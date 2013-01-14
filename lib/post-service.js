var PostService = (function() {
	return {
    initialize: function(dependencies, fn) {
      var self = this;

      self.mongoose = dependencies['mongoose'];
      self.db = self.mongoose.createConnection('127.0.0.1', 'nodeBlog');

      self.db.on('error', function() {
        fn('Error connecting to database');
      });
      
      self.db.once('open', function dbOpenCallback() {
        var postSchema = new self.mongoose.Schema({
          title: String,
          date: Date,
          author: String,
          content: String
        });

        self.Post = self.db.model('Post', postSchema);

        if (fn && typeof(fn) === 'function') {  
          fn();  
        }
      });
    },
    addPost: function(post, fn) {
      var postToSave = new this.Post(post);

      postToSave.save(function addPostCallback(err) {
        if (fn && typeof(fn) === 'function') {  
          fn(err);  
        }

      });
    },
    getPostsOrderedByDateDesc: function(fn) {
      this.Post.find().sort({date: -1}).execFind(function getPostsCallback(err, docs) {
        if (fn && typeof(fn) === 'function') {  
          fn(err, docs);  
        }

      });
    },
    removeAll: function(fn) {
      this.Post.remove({}, function removeAllCallback(err) {
        if (fn && typeof(fn) === 'function') {  
          fn(err);
        }

      });
    }
  };

})();

module.exports = PostService;