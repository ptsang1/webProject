const session = require('express-session');

const passport = require('passport'),
      LocalStrategy = require('passport-local');
      Users = require('../models/user.model'),
      bcrypt = require('bcryptjs')

module.exports = function (app) {
    passport.serializeUser((user, done) => {
        done(null, user);
    })

    passport.deserializeUser(async function (id, done) {
        // done(null, user);
        done(null, await Users.getUserByUserID(id));
        
    });

    passport.use('login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, async (email, password, done) => {
        console.log(email, password);
        user = await Users.getUserByEmail(email);
        if (user === null) {
            return done(null, false, {err_message: 'Email hoặc password bạn nhập đã không đúng.'});
        }

        const isPasswordCorrect = bcrypt.compareSync(password, user.password);
        if (isPasswordCorrect === false) {
            return done(null, null, {err_message: 'Email hoặc password bạn nhập đã không đúng.'});
        }

        let check = await Users.isUserAccepted(user.email);

        if (!check) {
            return done(null, null, {err_message: 'Tài khoản của bạn chưa được xác nhận. Hãy kiểm tra email và xác nhận tài khoản để đăng nhập nhé!'})
        }

        return done(null, user);

        // delete user.password_hash;
        // req.session.isAuthenticated = true;
        // req.session.authUser = user;
        // const url = req.query.retUrl || '/';
        // res.redirect(url);
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    // app.use(session({
    //     secret: 'keyboard cat',
    //     resave: true,
    //     saveUninitialized: true
    // }));
    // app.use(app.router);
};
