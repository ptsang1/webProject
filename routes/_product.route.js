const express = require('express');
const categoryModel = require('../models/category.model');
const productModel = require('../models/product.model');
const multer = require('multer');
const moment = require('moment');

const config = require('../config/default.json');
const router = express.Router();


router.use(express.static('public'));


router.get('/add', async function(req, res) {
    result = await categoryModel.all();
    res.render('vwProduct/add', {
        categories: result
    });
})

router.post('/add', async function(req, res) {
    const storage = multer.diskStorage({
        filename: function(req, file, cb) {
            cb(null, file.originalname)
        },
        destination: function(req, file, cb) {
            cb(null, `./public/images/`);
        },
    });
    const upload = multer({ storage });
    upload.array('input-b1', 3)(req, res, async function(err) {
        if (err) {

        } else {
            let tn = new Date();
            let catID = await categoryModel.singleByName(req.body.category);
            console.log(req.body);
            const entity = {
                sellerID: 'SellerVipPro',
                CatID: catID.catID,
                productName: req.body.productName,
                bidderID: '',
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
        }
    })
})

router.get('/detail', async function(req, res) {
    const item = await productModel.singleByID(req.query.id);
    let empty = false;
    const time = moment(item[0].timeEnd).fromNow();
    const product = {
        priceCurent: item[0].priceCurent,
        stepPrice: item[0].stepPrice ,
        bidPrice: item[0].stepPrice + item[0].priceCurent,
        price: item[0].price,
        productName: item[0].productName,
        bidderID: item[0].bidderID,
        sellerID: item[0].sellerID,
        time: time,
    };
    if (!item) empty = true;
    res.render('vwProduct/detail', {
        product,
        outOfStock: item.sold === 0,
        empty,
    });
});

router.post('/detail', async function(req, res) {
    const entity = {
        userID: bidderID,
        sellerID: sellerID,
        productID: req.query.id,
        };
    const rs = await productModel.saved(entity);
    const item = await productModel.singleByID(req.query.id);
    let empty = false;
    const time = moment(item[0].timeEnd).fromNow();
    const product = {
        priceCurent: item[0].priceCurent,
        stepPrice: item[0].stepPrice ,
        bidPrice: item[0].stepPrice + item[0].priceCurent,
        price: item[0].price,
        productName: item[0].productName,
        bidderID: item[0].bidderID,
        sellerID: item[0].sellerID,
        time: time,
    };
    if (!item) empty = true;
    res.render('vwProduct/detail', {
        product,
        outOfStock: item.sold === 0,
        empty,
    });
})

module.exports = router;