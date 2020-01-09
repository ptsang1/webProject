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
const ban_bidders = require('../models/ban_bidders.model');
const fs = require('fs');
// const config = require('../config/default.json');
const router = express.Router();


router.use(express.static('public'));

const restrict = require('../middlewares/auth.mdw');
router.get('/add', restrict, async function(req, res) {
    result = await categoryModel.all();
    res.render('vwProduct/add', {
        categories: result
    });
});

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
    res.redirect('/product/add');
});

router.get('/detail', async function(req, res) {
    if (req.query.sellerID) {
        if (!req.session.authUser) 
            res.redirect('/account/login');
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
    const sellerName = await userModel.singleByID(item.sellerID);
    const bidderName = await userModel.singleByID(item.bidderID);
    let history = await historyModel.allByProductID(req.query.id);
    for (let h of history) {
        let part = h.fullName.split(' ');
        h.fullName = "******" + part[part.length - 1] || "******";
    }
    // let name = sellerName.fullName.split(' ');
    // const seller = "******" + name[name.length - 1];
    const seller = sellerName.fullName;
    let bidder = '';
    if (bidderName) {
        name = bidderName.fullName.split(' ');
        bidder = "******" + name[name.length - 1];
    }
    let empty = false;
    const time = moment(item.timeEnd).fromNow();
    const product = {
        productID: item.productID,
        priceCurent: item.priceCurent,
        stepPrice: item.stepPrice,
        bidPrice: item.stepPrice + item.priceCurent,
        price: item.price,
        productName: item.productName,
        bidderID: item.bidderID,
        sellerID: item.sellerID,
        bidder,
        seller,
        timePost: item.timePost,
        time: time,
    };
    if (!item) empty = true;
    if (req.session.authUser != null &&
        req.session.authUser.userID === item.sellerID){
        return res.render('vwProduct/detail', {
            product,
            outOfStock: item.sold === 0,
            images,
            imgTitle: images[0],
            describe,
            history,
            empty,
            isSeller: true,
            bidders: await historyModel.listBidder(product.productID)
        });
    }
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

router.get('/detail_banBidder', async function(req, res){
    let bidder = await userModel.getUserByEmail(req.query.bidder);
    let product = await productModel.singleByID(req.query.id);
    let row = {
        sellerID: product.sellerID,
        productID: product.productID,
        bidderID: bidder.userID,        
    }
    await ban_bidders.add(row);
    await historyModel.removeHistoryAuction(bidder.userID, product.productID);
    if (product.bidderID === bidder.userID){
        const newBidder = await historyModel.getHighest(product.productID);
        console.log(newBidder);
        if (newBidder != null){
            await productModel.updateState(newBidder.bidderID, newBidder.offer, product.productID);
        }
        else{
            await productModel.updateState(product.sellerID, product.priceStart, product.productID);
        }
    }
    res.json("Cấm thành công");
});

router.get('/detailCheckBidder', async function(req, res){
    res.json(await ban_bidders.check(req.session.authUser.userID, req.query.id));
});

router.post('/detail', restrict, async function(req, res) {
    const user = req.session.authUser;

    const timeOffer = new Date();
    const entity = {
        sellerID: req.body.sellerID,
        productID: req.query.id,
        bidderID: user.userID,
        offer: req.body.bidPrice,
        timeOffer
    };
    await productModel.bidded(entity);
    await productModel.saveBidPrice(req.body.bidPrice, req.query.id, user.userID);

    const item = await productModel.singleByID(req.query.id);
    const images = await imageModel.allByProductID(req.query.id);
    const describe = await describeModel.single(req.query.id);
    const sellerName = await userModel.singleByID(item.sellerID);
    const bidderName = await userModel.singleByID(item.bidderID);
    let history = await historyModel.allByProductID(req.query.id);

    for (let h of history) {
        let part = h.fullName.split(' ');
        h.fullName = "******" + part[part.length - 1] || "******";
    }
    let name = sellerName.fullName.split(' ');
    // const seller = "******" + name[name.length - 1];
    // let bidder = '';
    if (bidderName) {
        name = bidderName.fullName.split(' ');
        bidder = "******" + name[name.length - 1];
    }
    // let empty = false;
    // const time = moment(item.timeEnd).fromNow();
    // const product = {
    //     productID: item.productID,
    //     priceCurent: item.priceCurent,
    //     stepPrice: item.stepPrice,
    //     bidPrice: item.stepPrice + item.priceCurent,
    //     price: item.price,
    //     productName: item.productName,
    //     bidderID: item.bidderID,
    //     sellerID: item.sellerID,
    //     bidder,
    //     seller,
    //     timePost: item.timePost,
    //     time: time,
    // };
    // if (!item) empty = true;
    // res.redirect(`/product/detail?id=${req.query.id}`);
    setTimeout(() => res.redirect(`/sendEmail/announceProductPriceUpdating?to=${user.userID}&product=${entity.productID}`), 1000);

});

router.get('/sell', restrict, async function(req, res) {
    const user = req.session.authUser;
    if (Number(user.roleID) !== 2) {
        res.redirect('/');
    }
    const sold = req.query.sold;
    const t = new Date();
    const time = moment(t).format('YYYY-MM-DD hh:mm:ss');
    let rows = await productModel.allSellProduct(user.userID, time);
    if (sold === 'true') {
        rows = await productModel.allSoldProduct(user.userID);
    }
    console.log(time);

    res.render('vwProduct/sellProduct', {
        product: rows,
        empty: rows.length === 0,
    });
});

module.exports = router;