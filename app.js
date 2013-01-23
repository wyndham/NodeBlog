var port = process.argv[2];

var dependencies = [];
dependencies['mongoose'] = require('mongoose');
dependencies['express'] = require('express');
dependencies['stylus'] = require('stylus');
dependencies['nib'] = require('nib');
dependencies['markdown'] = require('markdown');
dependencies['passport'] = require('passport')
dependencies['passport-local'] = require('passport-local');
dependencies['connect-flash'] = require('connect-flash');

var initHttpServer = function() {
  var HttpServer = require('./lib/http-server');
  var httpServer = HttpServer(dependencies);
  httpServer.run(port);
}

var initUserService = function() {
  var userService = require('./lib/user-service.js')
  userService.initialize(dependencies, function(err) {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    dependencies['user-service'] = userService;

    initHttpServer();
  });
}

var postService = require('./lib/post-service.js')
postService.initialize(dependencies, function(err) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  dependencies['post-service'] = postService;

  initUserService();
});


