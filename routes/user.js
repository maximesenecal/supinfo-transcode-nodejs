var express = require('express'),
    router = express.Router();

var session = require('express-session');
var passport = require('passport');

var FacebookStrategy = require('passport-facebook').Strategy;

//Middleware authentification
var isLoggedIn = require('../middlewares/auth');

var User = require('../models/user');

/*
 * Local authentification
 */
router.get('/', isLoggedIn, function (req, res) {
  res.send('View user - 10 Go');
});
//TODO: Faire le bouton deconnexion sur la vue
router.get('/login', function (req, res) {
  res.render('login', {message: req.flash('loginMessage')});
});

//TODO: Faire les messages flash côté vue
router.post('/login', passport.authenticate('local-login', {
  successRedirect : '/user/drive',
  failureRedirect : '/user/login',
  failureFlash : true
}));

router.get('/signup', function (req, res) {
  res.render('signup', {message: req.flash('signupMessage')});
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/user/drive',
  failureRedirect: '/user/signup',
  failureFlash: true
}));

router.get('/profile', isLoggedIn, function (req, res) {
  res.render('profile', {
    // get the user in the session
    user: req.user
  });
});

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/drive', function (req, res) {
  res.render('drive');
});

router.get('/actual', function (req,res){
  var currentIdUser = req.session.passport.user;
  User.findOne({ _id: currentIdUser }, function(err, user) {
    if(err)
        console.log(err);
    console.log(user.local.email);
    user.files.unshift({name: 'coucou'});
    user.save(function(err) {
      console.log('Erreur de save'+err);
    })
  });
  res.send('coucou');
});

/*
 * Facebook authentification
 */
/*
passport.initialize();
passport.use(new FacebookStrategy({
      clientID: config.facebookAuth.clientID,
      clientSecret: config.facebookAuth.clientSecret,
      callbackURL: config.facebookAuth.callbackURL,
      profileFields: ['emails']
    },
    function(accessToken, refreshToken, profile, done) {

      User.findOne({'facebook.id': profile.id}, function (err, user) {

        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err)
          return done(err);

        // if the user is found, then log them in
        if (user) {
          // TODO : Faire la redirection si utilisateur trouvé
          return done(null, user); // user found, return that user
        } else {
          var newUser = new User();

          // set all of the facebook infos in our user model
          newUser.facebook.id = profile.id;
          newUser.facebook.token = accessToken;
          newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
          newUser.facebook.email = profile.emails[0].value;
          
          // save user in db
          newUser.save(function (err) {
            if (err)
              throw err;
            // if successful, return the user
            console.log(newUser);
            return done(null, newUser);
          });
        }
      });
    }
));

router.get('/auth/facebook',
    passport.authenticate('facebook', { scope: 'email' }));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect: '/connect',
      successRedirect : '/profile'
    }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.render('/profile', {
        user : req.user // get the user out of session and pass to template
      });
    });
*/

module.exports = router;
