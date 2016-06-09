/**
 * Created by maximesenecal on 02/06/2016.
 */

module.exports = function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }
    // if they aren't redirect them to the home page
    console.log("Opération non permise, aucun utilisateur connecté");
    res.redirect('/');
};