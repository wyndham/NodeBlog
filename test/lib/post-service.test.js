var sinon = require('sinon');
var chai = require('chai')
  , expect = chai.expect
  , should = chai.should();
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var events = require('events');

var mongoose = require('mongoose');
sinon.spy(mongoose, 'createConnection');
sinon.spy(mongoose, 'Schema');
var dependencies = [];
dependencies['mongoose'] = mongoose;

var target;

describe('PostService', function() {

  beforeEach(function (done) {
    target = require('../../lib/post-service');
    target.initialize(dependencies, function(err) {
      done();
    });
  });

  afterEach(function(done) {
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
          content: String
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
          target.getPostsOrderedByDateDesc(function(err, result) {
            result.length.should.equal(1);
            done();
          });
        });
      });
    });

    describe('#getPosts', function() {
      it('should return all posts in the db', function(done) {
        var oldPost = createTestPost('Old Post', 200000);
        var newPost = createTestPost('New Post', 400000);

        target.addPost(oldPost, function(err) {
          target.addPost(newPost, function(err) {
            target.getPostsOrderedByDateDesc(function(err, result) {

              result[0].title.should.equal(newPost.title);
              result[1].title.should.equal(oldPost.title);
              done();
              
            });
          });
        });
      });
    });

  });
});

var createTestPost = function(title, date) {
  return {
    title: title,
    date: new Date(date),
    author: "rinse",
    content: "This is content for post " + title
  }
}