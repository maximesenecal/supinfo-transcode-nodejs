/**
 * Created by maximesenecal on 20/05/2016.
 */

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('transcoding', { title: 'Express' });
});

/**
 * node-fluent-ffmpeg
 * https://github.com/fluent-ffmpeg/node-fluent-ffmpeg
 */

var ffmpeg = require('fluent-ffmpeg');

//app.use(express.static(__dirname + '/flowplayer'));

/**
 * Conversion d'un fichier au format flv recu en GET
 */
router.get('/video/:filename', function(req, res) {
    res.contentType('flv');
    // make sure you set the correct path to your video file storage
    var pathToMovieInput = __dirname + '/storage/video-input/' + req.params.filename;
    var pathToMovieOutput = __dirname + '/storage/video-output/' + req.params.filename;
    var proc = ffmpeg(pathToMovieInput)
    // use the 'flashvideo' preset (located in /lib/presets/flashvideo.js)
        .preset('divx')
        // setup event handlers
        .on('end', function() {
            console.log('file has been converted succesfully');
        })
        .on('error', function(err) {
            console.log('an error happened: ' + err.message);
        })
        // save to stream
        //.pipe(res, {end:true});
        // save to local
        .save(pathToMovieOutput);
    // redirection vers la page d'accueil avec travail en arriere plan
    res.redirect('/');
});

module.exports = router;
