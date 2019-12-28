const express = require('express');
const router = express.Router();
const uuidv1 = require('uuid/v1');
const bcrypt = require('bcryptjs');
const db = require("../utils/db");
const config = require("../config/default.json");
const user = require("../models/user.model")

// var smtpTransport = nodemailer.createTransport({
//     service: "Gmail",
//     auth: {
//         user: config.authentication.username,
//         pass: config.authentication.password
//     }
// });


router.get('/', async function(req, res) {
    _gender = await db.load('select * from GENDERS');
    await res.render('register', {
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
    // const path = bcrypt.hashSync(newUser.email, config.authentication.salt),
    //       host = req.get('host'),
    //       link = `http://${host}/verify?id=${path}`;
    //       mailOptions={
    //         to : req.query.to,
    //         subject : "Please confirm your Email account",
    //         html : router.render("email/email.html")
    //       }

});

module.exports = router;