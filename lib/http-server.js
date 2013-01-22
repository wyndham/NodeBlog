var HttpServer = (function() {

  var HttpServer = function(dependencies) {
    var stylus = dependencies['stylus'];
    var nib = dependencies['nib'];
    var markdown = dependencies['markdown'].markdown;
    var passport = dependencies['passport'];
    var flash = require('connect-flash');
    var LocalStrategy = dependencies['passport-local'].Strategy;

    var postService = dependencies['post-service'];
    var userService = dependencies['user-service'];

    this.express = dependencies['express'];
    this.server = this.express();

    function compile(str, path) {
      return stylus(str)
        .set('filename', path)
        .use(nib());
    }

    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
      userService.getById(id, function(err, user) {
        done(err, user);
      });
    });

    passport.use(new LocalStrategy(
      function(username, password, done) {
        console.log(username + ' ' + password);
        userService.getByUsername(username, function (err, user) {
          if (err) { return done(err); }
          if (!user) {
            return done(null, false, { message: 'Incorrect credentials' });
          }
          if (!user.validPassword(password)) {
            return done(null, false, { message: 'Incorrect credentials' });
          }
          return done(null, user);
        });
      }
    ));


    this.server.set('views', __dirname + '/../views');
    this.server.set('view engine', 'jade');
    this.server.use(this.express.logger('dev'));
    this.server.use(stylus.middleware( { src: __dirname + '/../public', compile: compile } ));
    this.server.use(this.express.static(__dirname + '/../public'));
    this.server.use(this.express.cookieParser())
    this.server.use(this.express.bodyParser());
    this.server.use(this.express.methodOverride());
    this.server.use(this.express.session({ secret: 'funky town' }));
    this.server.use(flash());
    this.server.use(passport.initialize());
    this.server.use(passport.session());
    
    function getIndexPage(req, res) {

      postService.getPostsOrderedByDateDesc(5, function(err, posts) {
        res.render(
          'index', 
          { 
            md: markdown.toHTML, 
            siteName: 'Rinseworld',
            siteTagline: 'Pew pews and tinkle tinkles',
            title : 'Home', 
            user: req.user, 
            posts: posts,
            loginMessage: req.flash('error')
          }
        );
      });
    }

    this.server.get('/', function getRoot(req, res) {
      getIndexPage(req, res);
    });

    this.server.post('/login', 
      passport.authenticate('local', { failureRedirect: '/', failureFlash: true }),
      function(req, res) {
        res.redirect('/');
      }
    );

    this.server.post('/logout', function(req, res){
      req.logout();
      res.redirect('/');
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