/**
 * Created by maximesenecal on 08/05/2016.
 */

var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// load up the user model
var User = require('../models/user');

var config = require('../config/config');

// expose this function to our app using module.exports
module.exports = function(passport) {

    //used to serialize user in session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, email, password, done) {

            process.nextTick(function() {

                User.findOne({ 'local.email' :  email }, function(err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {
                        var newUser = new User();
                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));

    passport.use('local-login', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form
            User.findOne({ 'local.email' :  email }, function(err, user) {
                if (err)
                    return done(err);
                if (!user){
                    console.log('No user found');
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                }
                if (!user.validPassword(password)) {
                    console.log('Wrong password');
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                }
                // all is well, return successful user
                return done(null, user);
            });
        }));

    passport.use('facebook', new FacebookStrategy({
            clientID        : config.facebookAuth.clientID,
            clientSecret    : config.facebookAuth.clientSecret,
            callbackURL     : config.facebookAuth.callbackURL,
            profileFields: ['id', 'email']
        },

        // facebook will send back the tokens and profile
        function(access_token, refresh_token, profile, done) {
            // asynchronous
            process.nextTick(function() {

                // find the user in the database based on their facebook email
                User.findOne({ 'local.email' : profile.emails[0].value }, function(err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);
                    // if the user is found, then log them in
                    if (user) {
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user found with that facebook id, create them
                        var newUser = new User();

                        // set all of the facebook information in our user model
                        newUser.facebook.id    = profile.id; // set the users facebook id
                        newUser.facebook.access_token = access_token; // we will save the token that facebook provides to the user
                        newUser.facebook.firstName  = profile.name.givenName;
                        newUser.facebook.lastName = profile.name.familyName; // look at the passport user profile to see how names are returned
                        newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                        // save our user to the database
                        newUser.save(function(err) {
                            if (err)
                                throw err;

                            // if successful, return the new user
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));
};

