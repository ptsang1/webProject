const express = require('express');
const product = require("../models/product.model")

const router = express.Router();

router.get('/', async function(req, res) {
    result = await product.all();
<<<<<<< HEAD
    res.render('watch-list', {
=======

    res.render('home', {
>>>>>>> e6235cfd33ffc09d31d8b2263ceeafc7f191503b
        products: result,
        empty: result.length === 0,
    });
});

module.exports = router;