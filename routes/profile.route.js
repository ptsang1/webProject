const express = require('express');
const userModel = require('../models/user.model');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const config = require('../config/default.json');
const product = require("../models/product.model")
const router = express.Router();

router.get('/', async function(req, res) {
    const user = await userModel.singleByEmail('ngophat99@gmail.com');
    const gender = await userModel.getGender(user.genderID);
    const othergender = await userModel.getOtherGender(user.genderID);
    const dob = moment(user.birthDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
    console.log(othergender);
    res.render('vwProfile/infoProfile', {
        user,
        gender,
        other: othergender,
        dob
    });
});

router.post('/', async function(req, res) {
    const genderID = await userModel.getGenderByName(req.body.gender);
    console.log(genderID);
    const entity = {
        name: req.body.name,
        genderID,
        birthday: req.body.birthday,
        address: req.body.address,
        email: req.body.email,
    };
    const rt = await userModel.changeInfoByEmail(entity, 'ngophat99@gmail.com');


    const user = await userModel.singleByEmail('ngophat99@gmail.com');
    const gender = await userModel.getGender(user.genderID);
    const othergender = await userModel.getOtherGender(user.genderID);
    const dob = moment(user.birthDate, 'YYYY-MM-DD').format('YYYY-MM-DD');

    res.render('vwProfile/infoProfile', {
        user,
        gender,
        other: othergender,
        dob
    });
});

router.get('/setting', function(req, res) {
    res.render('vwProfile/settingProfile');
});

router.post('/setting', async function(req, res) {
    const user = await userModel.singleByEmail('ngophat99@gmail.com');
    const rs = bcrypt.compareSync(req.body.currentPassword, user.password);

    if (rs === true) {
        const newPassword = bcrypt.hashSync(req.body.newPassword, config.authentication.salt);
        const rt = await userModel.changePasswordByEmail('ngophat99@gmail.com', newPassword);

    } else {
        console.log(false);
    }
    res.render('vwProfile/settingProfile');
})

router.get('/product-watch-list', async function(req, res) {
    result = await product.all();
    res.render('vwProfile/productProfile', {
        products: result,
        empty: result.length === 0,
    });
});

router.get('/product-bidding-list', async function(req, res) {
    result = await product.all();
    res.render('vwProfile/productProfile2', {
        products: result,
        empty: result.length === 0,
    });
});

router.get('/product-won-list', async function(req, res) {
    result = await product.all();
    res.render('vwProfile/productProfile3', {
        products: result,
        empty: result.length === 0,
    });
});

router.use(express.static('public'));
module.exports = router;