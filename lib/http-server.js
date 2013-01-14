var HttpServer = (function() {

  var HttpServer = function(dependencies) {
    var stylus = dependencies['stylus'];
    var nib = dependencies['nib'];

    var postService = dependencies['post-service'];

    this.express = dependencies['express'];
    this.server = this.express();

    function compile(str, path) {
      return stylus(str)
        .set('filename', path)
        .use(nib());
    }

    this.server.set('views', __dirname + '/../views');
    this.server.set('view engine', 'jade');
    this.server.use(this.express.logger('dev'));
    this.server.use(stylus.middleware( { src: __dirname + '/../public', compile: compile } ));
    this.server.use(this.express.static(__dirname + '/../public'));

    function getIndexPage(req, res) {
      postService.getPostsOrderedByDateDesc(5, function(err, posts) {
        res.render('index', { title : 'Home', user: {}, posts: posts } );
      });
    }

    this.server.get('/', function getRoot(req, res) {
      getIndexPage(req, res);
    });
  }

  HttpServer.prototype.run = function(port) {
    this.server.listen(port);
  }

  return HttpServer;
  
})();

var initializer = function(dependencies) {
  return new HttpServer(dependencies);
}

module.exports = initializer;