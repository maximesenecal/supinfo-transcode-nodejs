var express = require('express');
var crypto = require('crypto');

var router = express.Router();

var User = require('../models/user.js');

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
