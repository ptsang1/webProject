const   express = require('express'),
        passport = require('passport'),
        FacebookStrategy = require('passport-facebook').Strategy,
        FACEBOOK_APP_ID='597601871017119',
        FACEBOOK_APP_SECRET='309103d16a7b9fe16d0f00cfbd154797',
        User = require('../models/user.model');
        uuidv1 = require('uuid/v1'),
        bodyParser = require('body-parser')
        router = express.Router();

router.use(passport.initialize());
router.use(passport.session());


passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['email', 'displayName', 'birthday', 'gender', 'photos']
    },
    async function(accessToken, refreshToken, profile, done) {
        user = await User.getUserByUserID(profile.id);
        if (user === null) {
            const user = {
                userID: profile.id,
                email: profile.emails[0].value,
                password: "123456",
                fullName: profile.name,
                birthDate: profile.birthDay,
                address: "",
                genderID: 1,
                roleID: 1,
                accepted: 1,
                avatar: profile.photos[0].value,
            }
            USERS.add(user);
            req.session.isAuthenticated = true;
            req.session.authUser = user;

            return done(null, user);
        } 
        return done(null, user);
    }
));
router.get('/auth/facebook/callback',
	passport.authenticate('facebook', { successRedirect : '/', failureRedirect: '/account/login' }),
    function(req, res) {
        // const url = req.query.retUrl || '/';
        res.redirect('/');
    });
    // function(req, res) {
    //     cout << "okk";
    //     const url = req.query.retUrl || '/';
    //     res.redirect(url);
    // }

// router.get('/facebook/callback',
//     passport.authenticate(
//         'facebook', 
//         {   successRedirect: '/', 
//             failureRedirect: '/account/login'})
//         // res.redirect('/');
//     // passport.authenticate('facebook', function(err, user, info){
//     //     console.log(err, user, info);
//     // })
// );

router.get('/facebook', passport.authenticate('facebook', {scope:'email'}));

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

module.exports = router;