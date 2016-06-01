var express = require('express'),
    crypto = require('crypto'),
    jwt = require('jsonwebtoken'),
    config = require('../config');

var router = express.Router();

// Model User
var User = require('../models/user.js');

// Inscription d'un nouvel utilisateur
router.get('/register', function(req, res) {
  res.render('register');
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
router.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });

  }
});

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

/* Add a new user */
router.get('/add', function(req, res) {

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
    res.json({ success: true });
  });
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
