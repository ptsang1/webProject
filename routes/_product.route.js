const express = require('express');
const categoryModel = require('../models/category.model');
const productModel = require('../models/product.model');
const multer = require('multer');
const upload = multer({ dest: 'upload/' });
const config = require('../config/default.json')
const router = express.Router();


router.get('/', async function(req, res) {
    result = await categoryModel.all();
    console.log(result);
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

/*router.get('/byCat/:catId', async function(req, res) {

    for (const c of res.locals.lcCategories) {
        if (c.CatID === +req.params.catId) {
            c.isActive = true;
        }
    }
    const page = +req.query.page || 1;
    if (page < 0) page = 1;
    const offset = (page - 1) * config.pagination.limit;



    const [total, rows] = await Promise.all([
        productModel.countByCat(req.params.catId),
        productModel.pageByCat(req.params.catId, offset)
    ])



    const nPages = Math.ceil(total / config.pagination.limit);

    page_items = [];
    for (i = 1; i <= nPages; i++) {
        const item = {
            value: i,
            isActive: i === page
        }
        page_items.push(item);
    }




    res.render('vwProducts/byCat', {
        products: rows,
        empty: rows.length === 0,
        page_items,
        can_go_prev: page > 1,
        can_go_next: page < nPages,
        next_value: page + 1,
        prev_value: page - 1,
    })
})
*/

module.exports = router;