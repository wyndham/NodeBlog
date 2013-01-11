var port = process.argv[2];


var dependencies = [];
dependencies['mongoose'] = require('mongoose');
dependencies['express'] = require('express');
dependencies['stylus'] = require('stylus');
dependencies['nib'] = require('nib');

var postService = require('./lib/post-service.js')
postService.initialize(dependencies, function(err) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  dependencies['post-service'] = postService;

  var HttpServer = require('./lib/http-server');
  var httpServer = HttpServer(dependencies);
  httpServer.run(port);
});


