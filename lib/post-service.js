var PostService = (function() {

	var PostService = function(dependencies) {
    var self = this;

		self.mongoose = dependencies['mongoose'];
		self.db = self.mongoose.createConnection('localhost', 'nodeBlog');

    self.db.on('error', console.error.bind(console, 'connection error:'));
    
    self.db.once('open', function dbOpenCallback() {
      var postSchema = new self.mongoose.Schema({
        title: String
      });

      self.posts = self.db.model('Post', postSchema);
    });

	};

	PostService.prototype.getPosts = function(fn) {
		this.posts.find({}, function findAllPostsCallback(err, docs) {
      fn(docs);
    });
	};

	return PostService;

})();

var initializer = function(dependencies) {
	return new PostService(dependencies);
};

module.exports = initializer;