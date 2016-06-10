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
  res.render('login');
});

//TODO: Faire les messages flash côté vue
router.post('/login', passport.authenticate('local-login', {
  successRedirect : '/user/drive',
  failureRedirect : '/user/login',
  failureFlash : true
}));

router.get('/signup', function (req, res) {
  res.render('signup');
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/user/drive',
  failureRedirect: '/user/signup',
  failureFlash: true
}));

router.get('/', isLoggedIn, function (req, res) {
  res.render('profile', {user: req.user});
});

router.get('/drive', isLoggedIn, function (req, res) {
  res.render('drive', {
    user: req.user,
    files: req.user.files
  });
});

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/actual', function (req,res){
  var currentIdUser = req.user.id;
  User.findOne({ _id: currentIdUser }, function(err, user) {
    if(err)
        console.log(err);
    var file = req.file;
    user.files.unshift(file);
    user.save(function(err) {
      console.log('Erreur de sauvegarde dans la base de donnée');
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

router.get('/login/google',
    passport.authenticate('google', { scope : ['profile', 'email'] }
    ));

router.get('/login/google/callback',
    passport.authenticate('google', {
      successRedirect : '/user/drive',
      failureRedirect : '/user/login'
    })
);

module.exports = router;
