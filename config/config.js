/**
 * Created by maximesenecal on 25/05/2016.
 */

//Local development database
/*
module.exports = {
    'secret': 'ac2b57078ab3491f011fabd3eb7cb813699bbc62',
    'database': 'mongodb://localhost/transcodedb',
    'facebookAuth' : {
        'clientID'      : '1175140152530100', // your App ID
        'clientSecret'  : 'e63a5cfd6c7e92beffce86a87c289676', // your App Secret
        'callbackURL'   : 'http://localhost:3000/user/auth/facebook/callback'
    }
};
*/

//Online development database
module.exports = {
    'secret': 'ac2b57078ab3491f011fabd3eb7cb813699bbc62',
    'database': 'mongodb://maximesenecal:ELZsT0ljt747@ds011472.mlab.com:11472/heroku_n2rdh20m',
    'facebookAuth' : {
        'clientID'      : '1175140152530100', // your App ID
        'clientSecret'  : 'e63a5cfd6c7e92beffce86a87c289676', // your App Secret
        'callbackURL'   : 'http://localhost:3000/user/auth/facebook/callback'
    }
};