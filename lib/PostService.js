var mongoose = require('mongoose');

var PostService = function() {
	this.db = mongoose.createConnection('localhost', 'nodeBlog');
};

PostService.prototype.getPost = function(postId) {
	return { title: "Title" };
};

module.exports = PostService;