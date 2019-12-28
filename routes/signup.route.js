const express = require('express');
const router = express.Router();
const uuidv1 = require('uuid/v1');
const bcrypt = require('bcryptjs');
const db = require("../utils/db");
const config = require("../config/default.json");

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        username: config.authentication.username,
        password: config.authentication.password
    }
});

router.get('/', async function(req, res) {
    const _gender = await db.load('select * from GENDERS');
    res.render('register', {
        layout: 'signin_signup.hbs', 
        template: 'signup',
        genders: _gender,
        empty: _gender.length === 0,
    });
});

router.post('/', async function(req, res){
    const password_hash = bcrypt.hashSync(req.body.password, config.authentication.salt);
    const newUser = {
        userID: uuidv1(),
        email: req.body.username,
        password: password_hash,
        fullName: req.body.name,
        birthDay: req.body.birthDay,
        address: req.body.address,
        gender: req.body.gender,
        role: 1,
        accepted: 0,
        avatar: "",
    }
});

module.exports = router;