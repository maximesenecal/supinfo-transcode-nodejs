/**
 * Created by maximesenecal on 25/05/2016.
 */

var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    Schema = mongoose.Schema;

var config = require('../config/config');

mongoose.connect(config.database, function(err) {
    if (err) { throw err; console.log("Erreur de connexion à la base de données MongoDB") }
    else { console.log('Connexion à la base de données MongoDB réussie') }
});

var userSchema = mongoose.Schema({
    username: String,
    first_name: String,
    last_name: String,
    admin: Boolean,
    local: {
        email: String,
        password: String,
    },
    facebook: {
        id: String,
        access_token: String,
        firstName: String,
        lastName: String,
        email: String
    },
    google: {
        id: String,
        access_token: String,
        firstName: String,
        lastName: String,
        email: String
    },
    drive: {
        limit: String,
        actual: String,
    },
    files: [
        {
            originalname: String,
            encoding: Number,
            mimetype: String,
            destination: String,
            filename: String,
            path: String,
            size: Number,
            download: Boolean
        }
    ]
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);