var port = process.argv[2];


var dependencies = [];
dependencies['mongoose'] = require('mongoose');
dependencies['express'] = require('express');
dependencies['stylus'] = require('stylus');
dependencies['nib'] = require('nib');


var HttpServer = require('./lib/http-server');
var httpServer = HttpServer(dependencies);
httpServer.run(port);