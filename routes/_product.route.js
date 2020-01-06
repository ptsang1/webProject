const express = require('express');
const categoryModel = require('../models/category.model');
const productModel = require('../models/product.model');
const multer = require('multer');
const upload = multer({ dest: 'upload/' });
const config = require('../config/default.json');
const router = express.Router();

router.get('/', async function(req, res) {
    result = await categoryModel.all();
    res.render('vwProduct/add', {
        categories: result
    });
})

router.post('/', upload.array('imageProduct', 3), async function(req, res) {
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

module.exports = router;