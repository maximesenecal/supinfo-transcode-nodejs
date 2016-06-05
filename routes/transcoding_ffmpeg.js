/**
 * Created by maximesenecal on 20/05/2016.
 */

var express = require('express'),
    isAuth = require('../middlewares/auth.js'),
    router = express.Router();

/*
 * Middleware pour vérifier le token
 */
router.use(isAuth);

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('transcoding', { title: 'Express' });
});

/**
 * node-fluent-ffmpeg
 * https://github.com/fluent-ffmpeg/node-fluent-ffmpeg
 */
var ffmpeg = require('fluent-ffmpeg');

//Lecteur en ligne
//app.use(express.static(__dirname + '/flowplayer'));

/**
 * Conversion d'un fichier au format flv recu en GET
 */
router.get('/video/:filename', function(req, res) {
    //res.contentType('flv');
    // make sure you set the correct path to your video file storage
    var pathToMovieInput = './storage/input/' + req.params.filename;
    var pathToMovieOutput = './storage/output/' + req.params.filename;
    var proc = ffmpeg(pathToMovieInput)
    // use the 'flashvideo' preset (located in /lib/presets/flashvideo.js)
        .preset('flashvideo')
        // setup event handlers
        .on('end', function() {
            console.log('file has been converted succesfully');
        })
        .on('error', function(err) {
            console.log('an error happened: ' + err.message);
        })
        .on('progress', function(progress){
            // TODO : Penser à utiliser cette progression dans la vue
            console.log('Processing: ' + progress.percent + '% done');
        })
        // save to stream
        //.pipe(res, {end:true});
        // save to local
        .save(pathToMovieOutput);
    /*
     * Redirection vers la page d'accueil avec travail en arriere plan
     */
    // TODO : Faire la redirection vers la page /user lorsqu'elle sera créée
    res.redirect('/');
});

/**
 * Conversion d'un fichier au format audio seulement
 */
router.get('/audio/:filename', function(req, res) {
    var pathToFileInput = './storage/input/' + req.params.filename;
    var pathToFileOutput = './storage/output/' + req.params.filename;
    var proc = ffmpeg(pathToFileInput)
        .preset('mp3')
        .on('end', function() {
            console.log('file has been converted succesfully into mp3');
        })
        .on('error', function(err) {
            console.log('an error happened: ' + err.message);
        })
        .on('progress', function(progress){
            console.log('Processing: ' + progress.percent + '%');
        })
        .save(pathToFileOutput);
    /*
     * TODO: Faire la redirection vers la page /user lorsqu'elle sera créée et envoyer les informations du fichier en cours
     */
    res.render('transcoding', { message: 'La conversion de votre fichier est en cours' });
});

module.exports = router;