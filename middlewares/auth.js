/**
 * Created by maximesenecal on 02/06/2016.
 */

module.exports = function isAuth(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                console.log("Token non reconnu");
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                console.log("Token vérifié avec succès");
                req.decoded = decoded;
                next();
            }
        });

    } else {
        console.log("Aucun token fourni");
        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
};