var assert = require('assert');
var sinon = require('sinon');

var PostService = require('../../lib/PostService');
var target = new PostService();

describe('PostService', function(){

  describe('#getPost()', function(){

    it('should return a post a title', function() {

      var postId = 'A_Post_Id';

      var result = target.getPost(postId);

      assert.equal('Title', result.title);
    })
  })
})