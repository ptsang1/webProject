const express = require('express');
const categoryModel = require('../models/category.model');
const productModel = require('../models/product.model');
const describeModel = require('../models/describe.model');
const userModel = require('../models/user.model');
const imageModel = require('../models/image.model');
const historyModel = require('../models/history.model');
const multer = require('multer');
const moment = require('moment');
const mkdirp = require('mkdirp');
const fs = require('fs');
const config = require('../config/default.json');
const router = express.Router();


router.use(express.static('public'));

const restrict = require('../middlewares/auth.mdw');
router.get('/add', restrict, async function(req, res) {
    result = await categoryModel.all();
    res.render('vwProduct/add', {
        categories: result
    });
})

router.post('/add', async function(req, res) {
    const row = await productModel.getNextID();
    const id = row[0].number;
    // tao thu muc chua anh
    mkdirp(`./public/images/${id}`, function(err) {
        if (err) console.error(err);
    });
    //load hinh len
    const storage = multer.diskStorage({
        filename: function(req, file, cb) {
            const filename = file.originalname;
            const fileExtension = filename.split(".")[1];

            cb(null, `${id}` + "-" + Date.now() + "." + fileExtension);
        },
        destination: function(req, file, cb) {
            cb(null, `./public/images/${id}`);
        },
    });
    const upload = multer({ storage });
    await upload.array('input-b1', 3)(req, res, async err => {
        if (err) {
            console.log(err);
        } else {
            let timePost = new Date();
            let catID = await categoryModel.singleByName(req.body.category);
            let timeEnd = new Date(new Date().getTime() + (10 * 24 * 60 * 60 * 1000));
            const user = req.session.authUser;
            const entity = {
                sellerID: user.userID,
                CatID: catID.catID,
                productName: req.body.productName,
                bidderID: null,
                priceCurent: req.body.priceCurrent,
                stepPrice: req.body.stepPrice,
                price: req.body.price,
                sold: 0,
                timePost: timePost,
                timeEnd: timeEnd
            };
            const rs = await productModel.add(entity);
            const des = req.body.describeProduct;
            if (des) await describeModel.add({
                productID: id,
                sellerID: user.userID,
                description: des,
                timeUpdate: timePost,
            });
            fs.readdir(`./public/images/${id}`, async function(err, items) {
                if (err) {
                    console.log(err);
                }
                for (let i = 0; i < items.length; i++) {
                    if (items[i]) await imageModel.add({
                        productID: id,
                        sellerID: user.userID,
                        imageLink: `images/${id}/${items[i]}`,
                    });
                }
            });
        }
    });


    //upload thong tin va anh va mo ta
    //render lại view
    result = await categoryModel.all();
    res.render('vwProduct/add', {
        categories: result
    });
})

router.get('/detail', async function(req, res) {
    if (req.query.sellerID) {
        if (!req.session.authUser) res.redirect('/account/login');
        const user = req.session.authUser;
        const entity = {
            userID: user.userID || '',
            sellerID: req.query.sellerID,
            productID: req.query.id,
        };
        const count = await productModel.checkSaved(entity.sellerID, entity.userID, entity.productID);
        if (Number(count) === 0) {
            let rs = await productModel.saved(entity);
        }
    }

    const item = await productModel.singleByID(req.query.id);
    const images = await imageModel.allByProductID(req.query.id);
    const describe = await describeModel.single(req.query.id);
    const sellerName = await userModel.singleByID(item[0].sellerID);
    const bidderName = await userModel.singleByID(item[0].bidderID);
    let history = await historyModel.allByProductID(req.query.id);
    for (let h of history) {
        let part = h.fullName.split(' ');
        h.fullName = "******" + part[part.length - 1] || "******";
    }
    let name = sellerName.fullName.split(' ');
    const seller = "******" + name[name.length - 1];
    let bidder = '';
    if (bidderName) {
        name = bidderName.fullName.split(' ');
        bidder = "******" + name[name.length - 1];
    }
    let empty = false;
    const time = moment(item[0].timeEnd).fromNow();
    const product = {
        productID: item[0].productID,
        priceCurent: item[0].priceCurent,
        stepPrice: item[0].stepPrice,
        bidPrice: item[0].stepPrice + item[0].priceCurent,
        price: item[0].price,
        productName: item[0].productName,
        bidderID: item[0].bidderID,
        sellerID: item[0].sellerID,
        bidder,
        seller,
        timePost: item[0].timePost,
        time: time,
    };
    if (!item) empty = true;
    res.render('vwProduct/detail', {
        product,
        outOfStock: item.sold === 0,
        images,
        imgTitle: images[0],
        describe,
        history,
        empty,
    });
});

router.post('/detail', restrict, async function(req, res) {
    const user = req.session.authUser;
    const timeOffer = new Date();
    console.log(req.body);
    const entity = {
        sellerID: req.body.sellerID,
        productID: req.query.id,
        bidderID: user.userID,
        offer: req.body.bidPrice,
        productID: req.query.id,
        timeOffer
    };
    await productModel.bidded(entity);
    await productModel.saveBidPrice(req.body.bidPrice, req.query.id, user.userID);

    const item = await productModel.singleByID(req.query.id);
    const images = await imageModel.allByProductID(req.query.id);
    const describe = await describeModel.single(req.query.id);
    const sellerName = await userModel.singleByID(item[0].sellerID);
    const bidderName = await userModel.singleByID(item[0].bidderID);
    let history = await historyModel.allByProductID(req.query.id);
    for (let h of history) {
        let part = h.fullName.split(' ');
        h.fullName = "******" + part[part.length - 1] || "******";
    }
    let name = sellerName.fullName.split(' ');
    const seller = "******" + name[name.length - 1];
    let bidder = '';
    if (bidderName) {
        name = bidderName.fullName.split(' ');
        bidder = "******" + name[name.length - 1];
    }
    let empty = false;
    const time = moment(item[0].timeEnd).fromNow();
    const product = {
        productID: item[0].productID,
        priceCurent: item[0].priceCurent,
        stepPrice: item[0].stepPrice,
        bidPrice: item[0].stepPrice + item[0].priceCurent,
        price: item[0].price,
        productName: item[0].productName,
        bidderID: item[0].bidderID,
        sellerID: item[0].sellerID,
        bidder,
        seller,
        timePost: item[0].timePost,
        time: time,
    };
    if (!item) empty = true;
    res.render('vwProduct/detail', {
        product,
        outOfStock: item.sold === 0,
        images,
        imgTitle: images[0],
        describe,
        history,
        empty,
    });
})




router.get('/sell', restrict, async function(req, res) {
    const user = req.session.authUser;
    if (Number(user.roleID) !== 2) {
        res.redirect('/');
    }
    const rows = await productModel.allSellProduct(user.userID);


    res.render('vwProduct/sellProduct', {
        product: rows,
        empty: rows.length === 0,
    });
});

module.exports = router;