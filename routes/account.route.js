const express = require('express'),
    uuidv1 = require('uuid/v1'),
    bcrypt = require('bcryptjs'),
    db = require("../utils/db"),
    config = require("../config/default.json"),
    USERS = require("../models/user.model");
    // passport = require('passport');

const router = express.Router();

// router.use(passport.initialize());

router.use(express.static('public'));

router.get('/signup', async function(req, res) {
    _gender = await db.load('select * from GENDERS');
    await res.render('vwAccount/register', {
        layout: 'signin_signup.hbs',
        template: 'signup',
        genders: _gender,
        empty: _gender.length === 0,
    });
});

router.post('/signup', async function(req, res) {
    const password_hash = bcrypt.hashSync(req.body.password, config.authentication.salt);
    const newUser = {
        userID: uuidv1(),
        email: req.body.email,
        password: password_hash,
        fullName: req.body.name,
        birthDate: req.body.birthday,
        address: req.body.address,
        genderID: req.body.gender,
        roleID: 1,
        accepted: 0,
        avatar: "",
    }
    USERS.add(newUser);
    res.redirect(`/sendEmail/confirmEmail/send?fullname=${newUser.fullName}&to=${newUser.email}&id=${newUser.userID}`);
});

router.get('/is-available', async function(req, res) {
    const check = await USERS.isEmailExisted(req.query.email);
    if (check) {
        return res.json("Email này đã được đăng ký rồi nè!");
    }
    res.json("");
});

router.get('/login', function(req, res) {
    if (req.session.isAuthenticated)
        return res.redirect('/');
    res.render('vwAccount/login', {
        layout: 'signin_signup.hbs',
        template: 'signup',
    });
});


router.post('/logout', function(req, res) {
    // req.logOut();
    req.session.isAuthenticated = false;
    req.session.authUser = null;
    res.redirect('/');
});

// router.post('/login', passport.authenticate('login', {
//     successRedirect: '/',
//     failureRedirect: '/login',
//     failureFlash : true 
// }));

router.post('/login', async function(req, res) {
    user = await USERS.getUserByEmail(req.body.email);
    if (user === null) {
        return res.render('vwAccount/login', {
            layout: 'signin_signup.hbs',
            template: 'signup',
            err_message: 'Email hoặc password bạn nhập đã không đúng.'
        });
    }

    const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (isPasswordCorrect === false) {
        return res.render('vwAccount/login', {
            layout: 'signin_signup.hbs',
            template: 'signup',
            err_message: 'Email hoặc password bạn nhập đã không đúng.'
        });
    }

    let check = await USERS.isUserAccepted(user.email);

    if (!check) {
        return res.render('vwAccount/login', {
            layout: 'signin_signup.hbs',
            template: 'signup',
            err_message: 'Tài khoản của bạn chưa được xác nhận. Hãy kiểm tra email và xác nhận tài khoản để đăng nhập nhé!'
        });
    }

    delete user.password_hash;
    req.session.isAuthenticated = true;
    req.session.authUser = user;
    const url = req.query.retUrl || '/';
    res.redirect(url);

    // res.redirect('/');
});

router.get('/forgottenPassword', function(req, res) {
    res.render('vwAccount/forgottenPassword', {
        layout: 'signin_signup.hbs',
        template: 'signup',
    });
});

router.get('/retrievePassword', function(req, res) {
    res.render('vwAccount/returnPassword', {
        layout: 'signin_signup.hbs',
        template: 'signup',
    });
});

router.post('/retrievePassword', async function(req, res) {
    const oldID = req.query.id;
    await USERS.changePasswordByID(oldID,  bcrypt.hashSync(req.body.password, config.authentication.salt));
    res.redirect('/');
});

router.post('/forgottenPassword', function(req, res) {
    res.redirect(`/sendEmail/changePassword?email=${req.body.email}`);
});

module.exports = router;