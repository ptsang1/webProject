const express = require('express');
const homeModel = require('../models/home.model');
const db = require("../utils/db");
const router = express.Router();

router.get('/', async function(req, res) {
    _gender = await db.load('select * from GENDERS');
    await res.render('home', {
        genders: _gender,
        empty: _gender.length === 0,
    });
});

module.exports = router;