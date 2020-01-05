const express = require('express');
const userModel = require('../models/user.model');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const config = require('../config/default.json');
const router = express.Router();

router.get('/', async function(req, res) {
    const user = await userModel.singleByEmail('ptsang@gmail.com');
    const gender = await userModel.getGender(user.genderID);
    const dob = moment(user.birthDate, 'YYYY-MM-DD').format('DD/MM/YYYY');
    console.log(dob);
    res.render('vwProfile/infoProfile', {
        user,
        genders: gender.genderName,
        dob
    });
});




router.get('/setting', function(req, res) {
    res.render('vwProfile/settingProfile');
});
router.post('/setting', async function(req, res) {
    const user = await userModel.singleByEmail('ptsang@gmail.com');
    const rs = bcrypt.compareSync(req.body.currentPassword, user.password);

    if (rs === true) {
        const newPassword = bcrypt.hashSync(req.body.newPassword, config.authentication.salt);
        const rt = await userModel.changePasswordByEmail('ptsang@gmail.com', newPassword);
        console.log(rt);
    } else {
        console.log(false);
    }
    res.render('vwProfile/settingProfile');
})





router.get('/productProfile', function(req, res) {
    res.render('vwProfile/productProfile');
});
router.use(express.static('public'));
module.exports = router;