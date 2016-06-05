var express = require('express'),
    crypto = require('crypto'),
    jwt = require('jsonwebtoken'),
    isAuth = require('../middlewares/auth.js'),
    config = require('../config');

var router = express.Router();

// Model User
var User = require('../models/user.js');

// Inscription d'un nouvel utilisateur

router.get('/register', function(req, res) {
  res.render('register');
});

router.get('/connect', function(req, res) {
  res.render('connect');
});

/* Add a new user */
router.get('/addsample', function(req, res) {

  // Create a sample user
  var user = new User({
    name: 'Justin Baroux',
    username: 'justinbaroux',
    password: hash('Supinf0'),
    admin: true
  });

  // Save in MongoDB
  user.save(function(err) {
    if (err) throw err;

    console.log('Utilisateur ' + user.name + ' a été créé avec succès');
    // TODO : Penser à faire la redirection après ajout
    res.json({ success: true });
  });
});

router.post('/add', function(req, res) {
  console.log(req.body);

  var user = new User({
    name: req.body.last_name,
    username: req.body.username,
    email: req.body.email,
    password: hash(req.body.password),
    admin: false
  });

  // Save in MongoDB
  user.save(function(err) {
    if (err) throw err;

    console.log('Utilisateur ' + user.name + ' a été créé avec succès');
    // TODO : Penser à faire la redirection après ajout
    res.json({ success: true });
  });
});

/*
 * Route authenticate a user
 */
router.post('/auth', function(req, res) {

  // POST find the user in x-www-form-urlencoded
  User.findOne({
    username: req.body.username
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, config.secret, {
          expiresIn: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }

    }

  });
});

/*
 * Middleware pour vérifier le token
 */
router.use(isAuth);

/*
 * Utilisation de crypto pour hash le pass
 */
hash = function(password) {
  return crypto.createHash('sha1').update(password).digest('base64')
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  // TODO : Faire le render sur la page de stockage de l'utilisateur
  res.send('View espace stockage utilisateur');
});

router.get('/profile', function(req, res, next) {
  res.send('User profile');
});

/* Get all users */
router.get('/all', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});

// TODO : Add a PUT route to update a user
// TODO : Add a DELETE route to delete a user

module.exports = router;
