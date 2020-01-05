const express = require('express');
const router = express.Router();
const uuidv1 = require('uuid/v1');
const bcrypt = require('bcryptjs');
const db = require("../utils/db");
const userModel = require('../models/user.model');
const config = require("../config/default.json");
const user = require("../models/user.model")
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
        accepted: 1,
        avatar: "",
    }
    user.add(newUser);
    res.redirect('/')
});

router.get('/login', function(req, res) {

    res.render('vwAccount/login', {
        layout: 'signin_signup.hbs',
        template: 'signup',
    });
});

router.post('/login', async function(req, res) {
    const user = await userModel.singleByEmail(req.body.email);
    if (user === null) {
        res.render('vwAccount/login', {
            layout: 'signin_signup.hbs',
            template: 'signup',
            err: 'Invalid Email or Password'
        });
    }
});


router.get('/forgottenPassword', function(req, res) {

    res.render('vwAccount/forgottenPassword', {
        layout: 'signin_signup.hbs',
        template: 'signup',
    });
});
module.exports = router;