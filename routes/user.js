var express = require('express'),
    router = express.Router();

var session = require('express-session');
var passport = require('passport');

var isLoggedIn = require('../middlewares/auth');

var User = require('../models/user');

/*
 * Local authentification
 */
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

router.get('/', isLoggedIn, function (req, res) {
  res.render('profile', {
    // get the user in the session
    username: req.user.username,
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.local.email
  });
});

router.get('/drive', isLoggedIn, function (req, res) {
  res.render('drive', {
    // get the user in the session
    files: req.user.files
  });
});

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
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
router.get('/login/facebook',
    passport.authenticate('facebook', { scope : 'email' }
    ));

router.get('/login/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect : '/user/drive',
      failureRedirect : '/user/login'
    })
);

module.exports = router;
