/**
 * Created by maximesenecal on 25/05/2016.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    config = require('../config');

// N'oubliez pas de lancer mongod dans un terminal !
mongoose.connect(config.database, function(err) {
    if (err) { throw err; console.log("Erreur de connexion à la base de données MongoDB") }
    else { console.log('Connexion à la base de données MongoDB réussie') }
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({
    name: String,
    username: String,
    password: String,
    admin: Boolean
}));