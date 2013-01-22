var sinon = require('sinon');
var chai = require('chai')
  , expect = chai.expect
  , should = chai.should();
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var events = require('events');

var mongoose = require('mongoose');
var dependencies = [];
dependencies['mongoose'] = mongoose;

var target;

var createTestPost = function(title, date) {
  return {
    title: title,
    date: new Date(date),
    author: "rinse",
    content: "This is content for post " + title
  };
}

describe('PostService', function() {

  beforeEach(function (done) {

    sinon.spy(mongoose, 'createConnection');
    sinon.spy(mongoose, 'Schema');

    target = require('../../lib/post-service');
    target.initialize(dependencies, function(err) {
      done();
    });
  });

  afterEach(function(done) {

    mongoose.createConnection.restore();
    mongoose.Schema.restore();

    target.removeAll(function(err) {
      done();
    });
  });

  describe('#constructor', function() {
    it('should initialize the db connection', function() {
      mongoose.createConnection.should.have.been.calledWith('127.0.0.1', 'nodeBlog');
    });

    describe('on db connection', function() {
      it('should create the post model', function(done) {
        mongoose.Schema.should.have.been.calledWith({
          title: String,
          date: Date,
          author: String,
          content: String,
          category: String
        });
        done();
      });
    });
  });

  describe('adding and removing posts', function() {
    
    describe('#addPost', function() {
      it ('should add the post to the collection', function(done) {
        var newPost = createTestPost('New Post', 400);
        target.addPost(newPost, function(err) {
          target.getPostsOrderedByDateDesc(5, function(err, result) {
            result.length.should.equal(1);
            done();
          });
        });
      });
    });

    describe('#getPostsOrderedByDateDesc', function() {
      var oldPost = createTestPost('Old Post', 200000);
      var newPost = createTestPost('New Post', 400000);

      beforeEach(function (done) {
        target.addPost(oldPost, function(err) {
          target.addPost(newPost, function(err) {
            done();
          });
        });
      });

      it('should return the posts in reverse chronological order', function(done) {
        target.getPostsOrderedByDateDesc(2, function(err, result) {
          result[0].title.should.equal(newPost.title);
          result[1].title.should.equal(oldPost.title);
          done();
        });
      });

      it('should return only the number of posts requested', function(done) {
        var numberOfPosts = 1;

        target.getPostsOrderedByDateDesc(numberOfPosts, function(err, result) {
          result.length.should.equal(numberOfPosts);
          done();
        });
      });
    });

  });
});