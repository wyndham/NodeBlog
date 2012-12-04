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

var PostService = require('../../lib/post-service');
var target;

describe('PostService', function() {

  beforeEach(function (done) {
    target = new PostService(dependencies);

    target.db.once('open', function() {
      done();
    });
  });

  describe('#constructor', function() {
    it('should initialize the db connection', function() {
      mongoose.createConnection.should.have.been.calledWith('localhost', 'nodeBlog');
    });

    describe('on db connection', function() {

      it('should create the post model', function(done) {

        mongoose.Schema.should.have.been.calledWith({
          title: String
        });
        //dbMock.model.should.have.been.calledWith('Post', postSchema);
        //target.Posts.should.equal(postModel);

        done();
      });
    });
  });

  describe('#getPosts', function() {
    var result;

    beforeEach(function(done) {
      target.getPosts(function(docs) {
        result = docs;

        done();
      });
    });

    afterEach(function(done) {
      target.posts.remove(function(err) {
        done();
      });
    });

    it('should return all posts in the db', function() {
      result.should.exist;
    })
  })
})