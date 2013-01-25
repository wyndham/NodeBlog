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

describe('UserService', function() {

  beforeEach(function (done) {

    sinon.spy(mongoose, 'createConnection');
    sinon.spy(mongoose, 'Schema');

    target = require('../../lib/user-service');
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
      it('should create the user model', function(done) {
        mongoose.Schema.should.have.been.calledWith({
          username: String,
          password: String,
          displayName: String
        });
        done();
      });
    });
  });

  describe('#addUser', function() {
    it('should add a user to the database', function(done) {
      var testUsername = 'testUsername';
      var testPassword = 'testPassword';
      var testDisplayName = 'testDisplayName';
      var user = {username: testUsername, password: testPassword, displayName: testDisplayName};

      target.addUser(user, function(err) {
        target.getByUsername(testUsername, function(err, user) {
          user.username.should.equal(testUsername);
          user.password.should.equal(testPassword);
          user.displayName.should.equal(testDisplayName);

          done();
        })
      })
    });
  });

  describe('#getByUsername', function() {
    it('should pass user to callback if valid username', function(done) {
      var testUsername = 'testUsername';

      target.addUser({username: testUsername, password: ""}, function() {
        target.getByUsername(testUsername, function(err, user) {
          user.should.exist;
            done();
        });
      });
    });
  });
});