const express = require('express');
const product = require("../models/product.model")

const router = express.Router();

router.get('/', async function(req, res) {
    result = await product.all();

    res.render('home', {
        products: result,
        empty: result.length === 0,
    });
});

module.exports = router;