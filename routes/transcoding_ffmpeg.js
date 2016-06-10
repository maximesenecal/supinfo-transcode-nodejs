/**
 * Created by maximesenecal on 20/05/2016.
 */

var express = require('express'),
    multer = require('multer'),
    router = express.Router();
/**
 * node-fluent-ffmpeg
 * https://github.com/fluent-ffmpeg/node-fluent-ffmpeg
 */
var ffmpeg = require('fluent-ffmpeg');

var isLoggedIn = require('../middlewares/auth');

var User = require('../models/user');

//TODO: Faire la vérification avec multer sur le choix des formats de fichiers lors de l'upload
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/input')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

router.post('/', isLoggedIn, multer({ storage: storage }).single('upl'), function(req,res){
    var file = req.file,
        currentIdUser = req.user.id;

    /*User.findOne({ _id: currentIdUser }, function(err, user) {
        if(err)
            console.log(err);

        user.update(
            { _id: currentIdUser },
            { $push: {
                files: file
            } }
        );

        user.save(function(err) {
            console.log('Erreur de sauvegarde dans la base de donnée');
        });
    });
    */

    if(req.file.mimetype == 'video/mp4' || req.file.mimetype == 'video/quicktime' || req.file.mimetype == 'video/avi')
        res.redirect('transcoding/video/' + req.file.originalname +'/'+ req.body.formatChoice);
    else if(req.file.mimetype == 'audio/mpeg' || req.file.mimetype == 'audio/mp3')
        res.redirect('transcoding/audio/' + req.file.originalname +'/'+ req.body.formatChoice);
    else
        res.send('Format non pris en charge actuellement');
});

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
    res.render('transcoding', {user: req.user});
});

/**
 * Conversion d'un fichier video
 */
router.get('/video/:filename/:format', isLoggedIn, function(req, res) {
    var pathToMovieInput = 'uploads/input/' + req.params.filename;
    var pathToMovieOutput = 'uploads/output/' + req.params.filename;
    var formatOutput = req.params.format;
    
    var proc = ffmpeg(pathToMovieInput)
        .preset(formatOutput)
        .on('end', function() {
            console.log('file has been converted successfully');
        })
        .on('error', function(err) {
            console.log('an error happened: ' + err.message);
        })
        .on('progress', function(progress){
            // TODO : Penser à utiliser cette progression dans la vue
            console.log('Processing: ' + progress.percent + '% done');
        })
        .save(pathToMovieOutput);
    res.render('drive', { user: req.user, message: 'La conversion de votre fichier est en cours' });
});

/**
 * Conversion d'un fichier au format audio seulement
 */
router.get('/audio/:filename', isLoggedIn, function(req, res) {
    var pathToFileInput = 'uploads/input/' + req.params.filename;
    var pathToFileOutput = 'uploads/output/' + req.params.filename;
    var formatOutput = req.params.format;

    var proc = ffmpeg(pathToFileInput)
        .preset(formatOutput)
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
    res.render('drive', { user: req.user, message: 'La conversion de votre fichier est en cours' });
});

module.exports = router;