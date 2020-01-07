// passport = require('passport'),
//       FacebookStrategy = require('passport-facebook').Strategy,
//       FACEBOOK_APP_ID='597601871017119',
//       FACEBOOK_APP_SECRET='309103d16a7b9fe16d0f00cfbd154797';

// passport.use(new FacebookStrategy({
//     clientID: FACEBOOK_APP_ID,
//     clientSecret: FACEBOOK_APP_SECRET,
//     callbackURL: "http://localhost:3000/auth/facebook/callback"
//     },
//     function(accessToken, refreshToken, profile, done) {
//     User.findOrCreate(..., function(err, user) {
//         if (err) { return done(err); }
//         done(null, user);
//     });
//     }
// ));