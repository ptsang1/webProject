const express = require('express');
const product = require("../models/product.model")

const router = express.Router();
router.use(express.static('public'));
const categoryModel = require('../models/category.model');
router.use(async function(req, res, next) {
    const rows = await categoryModel.allWithDetails();
    res.locals.lcCategories = rows;
    next();
})


router.get('/', async function(req, res) {
    topEnd = await product.topFiveProductEnd();
    topStar = await product.topFiveProductStar();
    topVal = await product.topFiveProductValue();
    res.render('vwProduct/home', {
        topEnd,
        topStar,
        topVal,
        empty: topEnd.length === 0,
    });
});

router.get('/byCat', async function(req, res) {
    res.render('vwProduct/byCat', {
        empty: true
    });
    //res.render('vwProduct/byCat', {
    //  products: rows,
    // empty: rows.length === 0,
    //})
})

module.exports = router;