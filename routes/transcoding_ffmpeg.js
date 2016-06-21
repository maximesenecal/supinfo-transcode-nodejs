/**
 * Created by maximesenecal on 20/05/2016.
 */

var express = require('express'),
    multer = require('multer'),
    router = express.Router(),
    mongoose = require('mongoose');

/**
 * node-fluent-ffmpeg
 * https://github.com/fluent-ffmpeg/node-fluent-ffmpeg
 */
var ffmpeg = require('fluent-ffmpeg');

var isLoggedIn = require('../middlewares/auth');

var User = require('../models/user');

router.get('/', isLoggedIn, function(req, res, next) {
    res.render('transcoding', {
        user: req.user});
});

// TODO: Faire la vérification avec multer sur le choix des formats de fichiers lors de l'upload
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

    console.log(file);

    if(req.file.mimetype == 'video/mp4' || req.file.mimetype == 'video/quicktime' || req.file.mimetype == 'video/avi') {
        User.findOne({_id: currentIdUser}, function (err, user) {
            if (err)
                console.log(err);
            file.download = false;
            user.files.push(file);
            user.save(function (err) {
                if (err)
                    console.log(err);
                else
                    console.log("Fichier vidéo ajouté à la liste de l'utilisateur");
            });

        });
        res.redirect('transcoding/video/' + req.file.originalname + '/' + req.body.formatChoice);
    }

    else if(req.file.mimetype == 'audio/mpeg' || req.file.mimetype == 'audio/mp3'){
        User.findOne({_id: currentIdUser}, function (err, user) {
            if (err)
                console.log(err);
            file.download = false;
            user.files.push(file);
            user.save(function (err) {
                if (err)
                    console.log(err);
                else
                    console.log("Fichier audio ajouté à la liste de l'utilisateur");
            });

        });
        res.redirect('transcoding/audio/' + req.file.originalname +'/'+ req.body.formatChoice);
    }
    else
        res.render('transcoding', {
            user: req.user,
            message: 'Format non prit en charge...'});
});

/**
 * Conversion d'un fichier video
 */
router.get('/video/:filename/:format', isLoggedIn, function(req, res) {
    var pathToFileInput     = 'uploads/input/' + req.params.filename,
        pathToFileOutput    = 'uploads/output/' + req.params.filename;

    var formatOutput = req.params.format,
        currentIdUser = req.user.id;

    User.findOne({ _id: currentIdUser }, function(err, user) {
        if (err)
            console.log(err);

        var idFile = user.files[user.files.length-1]._id,
            file = user.files.id(idFile);

        var proc = ffmpeg(pathToFileInput)
            .preset(formatOutput)
            .on('end', function() {

                file.downloadUrl = '/'+pathToFileOutput;
                file.download = true;

                user.save(function(err) {
                    if (err)
                        console.log(err);
                    else
                        console.log("Fichier convertit et téléchargement prêt.");
                });
            })
            .on('error', function(err) {
                file.error = true;
                console.log('an error happened: ' + err.message);
            })
            .on('progress', function(progress){
                // TODO : Utiliser cette progression dans la vue
                console.log('Conversion en cours : ' + progress.percent + '% effectuée');
            })
            .save(pathToFileOutput);
    });

    res.render('drive', {
        user: req.user,
        files: req.user.files,
        message: 'La conversion de votre fichier est en cours. Vous allez recevoir un mail lorsque ce sera terminé.'});
});

/**
 * Conversion d'un fichier au format audio seulement
 */
router.get('/audio/:filename/:format', isLoggedIn, function(req, res) {
    var pathToFileInput     = 'uploads/input/' + req.params.filename,
        pathToFileOutput    = 'uploads/output/' + req.params.filename;

    var formatOutput = req.params.format,
        currentIdUser = req.user.id;

    var proc = ffmpeg(pathToFileInput)
        .preset(formatOutput)
        .on('end', function() {
            User.findOne({ _id: currentIdUser }, function(err, user) {
                if (err)
                    console.log(err);

                var idFile = user.files[user.files.length-1]._id;
                var file = user.files.id(idFile);

                file.downloadUrl = '/'+pathToFileOutput;
                file.download = true;

                user.save(function(err) {
                    if (err)
                        console.log(err);
                    else
                        console.log("Fichier convertit et téléchargement prêt.");
                });
            });
        })
        .on('error', function(err) {
            console.log('an error happened: ' + err.message);
        })
        .on('progress', function(progress){
            console.log('Processing: ' + progress.percent + '%');
        })
        .save(pathToFileOutput);
    res.render('drive', {
        user: req.user,
        files: req.user.files,
        message: 'La conversion de votre fichier est en cours' });
});

module.exports = router;