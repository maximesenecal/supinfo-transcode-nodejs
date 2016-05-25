var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/profile', function(req, res, next) {
  res.send('Profil de l\'utilisateur');
});

// TODO : Add a PUT route to update a user
// TODO : Add a DELETE route to delete a user

module.exports = router;
