const express = require('express');
const product = require("../models/product.model");
const categoryModel = require('../models/category.model');
const stringCompare = require('string-similarity');
const config = require('../config/default.json');

const router = express.Router();
router.use(express.static('public'));



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
router.post('/', async function(req, res) {
    const name = req.body.search;
    let flag = false;
    for (const c of res.locals.lcCategories) {
        if (c.CatName === name) {
            res.redirect(`/byCat?id=${c.CatID}&sort=ASC`);
            flag = true;
        }
    }
    if (flag === false) {
        const products = await product.all();
        let productName = [];
        for (const p of products) {
            productName.push(p.productName);
        }
        const rs = stringCompare.findBestMatch(name, productName);
        if (rs.bestMatch.rating >= 0.4) {
            res.redirect(`/product/detail?id=${products[rs.bestMatchIndex].productID}`);
        } else res.render('vwProduct/404');
    }
});
router.get('/byCat', async function(req, res) {
    for (const c of res.locals.lcCategories) {
        if (c.CatID === +req.query.id) {
            c.isActive = true;
        }
    }
    console.log(req.query.id);
    let id = req.query.id;
    let sort = req.query.sort;
    if (!id || !sort) {
        id = 1;
        sort = 'ASC';
    }
    console.log(id);
    const page = +req.query.page || 1;
    if (page < 0) page = 1;
    const offset = (page - 1) * config.pagination.limit;

    const total = await product.countByCat(id);
    let rows = await product.pageByCatOrderValueASC(id, offset);
    if (sort === 'ASC') {
        rows = await product.pageByCatOrderValueASC(id, offset);
    } else if (sort === 'DESC') {
        rows = await product.pageByCatOrderValueDESC(id, offset);
    } else if (sort === 'TASC') {
        rows = await product.pageByCatOrderTimeASC(id, offset);
    } else if (sort === 'TDESC') {
        rows = await product.pageByCatOrderTimeDESC(id, offset);
    }

    const nPages = Math.ceil(total / config.pagination.limit);

    page_items = [];
    for (i = 1; i <= nPages; i++) {
        const item = {
            value: i,
            id,
            sort,
            isActive: i === page
        }
        page_items.push(item);
    }

    console.log(req.query);

    res.render('vwProduct/byCat', {
        product: rows,
        empty: rows.length === 0,
        page_items,
        can_go_prev: page > 1,
        can_go_next: page < nPages,
        next_value: page + 1,
        prev_value: page - 1,
        id,
        sort,
    })
})


router.get('/watch-list', async function(req, res) {
    result = await product.all();
    res.render('vwProduct/watch-list', {
        products: result,
        empty: result.length === 0,
    });
});

module.exports = router;