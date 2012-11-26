var port = process.argv[2];

var express = require('express');
var stylus = require('stylus');
var nib = require('nib');

var postService = require('./lib/PostService');

var app = express();

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(stylus.middleware( { src: __dirname + '/public', compile: compile } ));
app.use(express.static(__dirname + '/public'));

function getIndexPage(req, res) {
  res.render('index', { title : 'Home' } );
}

app.get('/', function getRoot(req, res) {
  getIndexPage(req, res);
});

app.listen(port);
