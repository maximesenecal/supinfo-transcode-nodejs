/**
 * Created by maximesenecal on 23/05/2016.
 */

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('encoding_choice', { title: 'Express' });
});

module.exports = router;