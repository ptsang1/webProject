const express = require('express');
const product = require("../models/product.model");
const userModel = require('../models/user.model');
const HandlebarsIntl = require('handlebars-intl');
const stringCompare = require('string-similarity');
const config = require('../config/default.json');
const router = express.Router();
const Handlebars = require('handlebars');

router.use(express.static('public'));

HandlebarsIntl.registerWith(Handlebars);

router.get('/', async function(req, res) {
    const topEnd = await product.topFiveProductEnd();
    topEndItems = [];
    for (i = 0; i < topEnd.length; i++) {
        const bidderName = await userModel.singleByID(topEnd[i].bidderID);
        if (bidderName) {
            name = bidderName.fullName.split(' ');
            bidder = "******" + name[name.length - 1];
        }
        else {
            bidder = "N/A";
        }
        const item = {
            productID: topEnd[i].productID,
            imageLink: topEnd[i].imageLink,
            productName: topEnd[i].productName,
            price: topEnd[i].price,
            priceCurent: topEnd[i].priceCurent,
            bidderID: topEnd[i].bidderID,
            bidder,
            timePost: topEnd[i].timePost,
            timeEnd: topEnd[i].timeEnd
        }
        topEndItems.push(item);
    }
    const topStar = await product.topFiveProductStar();
    topStarItems = [];
    for (i = 0; i < topStar.length; i++) {
        const bidderName = await userModel.singleByID(topStar[i].bidderID);
        if (bidderName) {
            name = bidderName.fullName.split(' ');
            bidder = "******" + name[name.length - 1];
        }
        else {
            bidder = "N/A";
        }
        const item = {
            productID: topStar[i].productID,
            imageLink: topStar[i].imageLink,
            productName: topStar[i].productName,
            price: topStar[i].price,
            priceCurent: topStar[i].priceCurent,
            bidderID: topStar[i].bidderID,
            bidder,
            timePost: topStar[i].timePost,
            timeEnd: topStar[i].timeEnd
        }
        topStarItems.push(item);
    }
    const topVal = await product.topFiveProductValue();
    topValItems = [];
    for (i = 0; i < topStar.length; i++) {
        const bidderName = await userModel.singleByID(topVal[i].bidderID);
        if (bidderName) {
            name = bidderName.fullName.split(' ');
            bidder = "******" + name[name.length - 1];
        }
        else {
            bidder = "N/A";
        }
        const item = {
            productID: topVal[i].productID,
            imageLink: topVal[i].imageLink,
            productName: topVal[i].productName,
            price: topVal[i].price,
            priceCurent: topVal[i].priceCurent,
            bidderID: topVal[i].bidderID,
            bidder,
            timePost: topVal[i].timePost,
            timeEnd: topVal[i].timeEnd
        }
        topValItems.push(item);
    }
    res.render('vwProduct/home', {
        topEndItems,
        topStarItems,
        topValItems,
        empty: topEnd.length === 0,
        // lcAuthUser: req.session.passport.user,
        // lcIsAuthenticated: req.session.passport!=null 
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
        if (rs.bestMatch.rating >= 0.2) {
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
    let id = req.query.id;
    let sort = req.query.sort;
    if (!id || !sort) {
        id = 1;
        sort = 'ASC';
    }
    const page = +req.query.page || 1;
    if (page < 0) page = 1;
    const offset = (page - 1) * config.pagination.limit;

    const total = await product.countByCat(id);
    let rows = await product.pageByCatOrderValueASC(id, offset);
    if (sort === 'ASC') {
        sortNo = 1;
        rows = await product.pageByCatOrderValueASC(id, offset);
    } else if (sort === 'DESC') {
        sortNo = 2;
        rows = await product.pageByCatOrderValueDESC(id, offset);
    } else if (sort === 'TASC') {
        sortNo = 3;
        rows = await product.pageByCatOrderTimeASC(id, offset);
    } else if (sort === 'TDESC') {
        sortNo = 4;
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
    products = [];
    for (i = 0; i < rows.length; i++) {
        const bidderName = await userModel.singleByID(rows[i].bidderID);
        if (bidderName) {
            name = bidderName.fullName.split(' ');
            bidder = "******" + name[name.length - 1];
        }
        else {
            bidder = "N/A";
        }
        const item = {
            productID: rows[i].productID,
            imageLink: rows[i].imageLink,
            productName: rows[i].productName,
            price: rows[i].price,
            priceCurent: rows[i].priceCurent,
            bidderID: rows[i].bidderID,
            bidder,
            timeEnd: rows[i].timeEnd
        }
        products.push(item);
    }
    res.render('vwProduct/byCat', {
        products,
        empty: rows.length === 0,
        page_items,
        can_go_prev: page > 1,
        can_go_next: page < nPages,
        next_value: page + 1,
        prev_value: page - 1,
        id,
        sort,
        sortASC: sortNo === 1,
        sortDESC: sortNo === 2,
        sortTASC: sortNo === 3,
        sortTDESC: sortNo === 4,
    })
})

module.exports = router;