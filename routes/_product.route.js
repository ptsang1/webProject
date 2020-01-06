const express = require('express');
const categoryModel = require('../models/category.model');
const productModel = require('../models/product.model');
const multer = require('multer');
const moment = require('moment');
const upload = multer({ dest: 'upload/' });
const config = require('../config/default.json');
const router = express.Router();
router.use(express.static('public'));
router.get('/add', async function(req, res) {
    result = await categoryModel.all();
    res.render('vwProduct/add', {
        categories: result
    });
})


router.post('/add', upload.array('imageProduct', 3), async function(req, res) {
    let tn = new Date();
    let catID = await categoryModel.singleByName(req.body.category);
    console.log(req.body);
    const entity = {
        sellerID: 'asdfghjkl',
        CatID: catID.catID,
        productName: req.body.productName,
        bidderID: 'e6bc4520-2ec3-11ea-a05e-3b204d425aa5',
        priceCurent: req.body.priceCurrent,
        stepPrice: req.body.stepPrice,
        price: req.body.price,
        sold: 0,
        timePost: tn,
        timeEnd: tn
    };

    const rs = await productModel.add(entity);
    result = await categoryModel.all();
    res.render('vwProduct/add', {
        categories: result
    });
})


router.get('/detail', async function(req, res) {

    const item = await productModel.singleByID(req.query.id);
    let empty = false;
    const time = moment(item[0].timeEnd).fromNow();
    const product = {
        priceCurent: item[0].priceCurent,
        stepPrice: item[0].stepPrice,
        price: item[0].price,
        productName: item[0].productName,
        bidderID: item[0].bidderID,
        time: time,
    };
    if (!item) empty = true;
    res.render('vwProduct/detail', {
        product,
        outOfStock: item.sold === 0,
        empty,
    });
});

module.exports = router;