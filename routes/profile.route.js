const express = require('express');
const userModel = require('../models/user.model');
const requestModel = require('../models/request.model');
const commentModel = require('../models/comment.model');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const config = require('../config/default.json');
const product = require("../models/product.model")
const router = express.Router();

const restrict = require('../middlewares/auth.mdw');
router.get('/', restrict, async function(req, res) {
    const user = req.session.authUser;
    const Strname = user.fullName.split(' ');
    const name = Strname[Strname.length - 1];
    const gender = await userModel.getGender(user.genderID);
    const othergender = await userModel.getOtherGender(user.genderID);
    const dob = moment(user.birthDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
    res.render('vwProfile/infoProfile', {
        user,
        name,
        gender,
        other: othergender,
        dob
    });
});

router.post('/', async function(req, res) {
    const genderID = await userModel.getGenderByName(req.body.gender);
    console.log(genderID);
    const entity = {
        name: req.body.name,
        genderID,
        birthday: req.body.birthday,
        address: req.body.address,
        email: req.body.email,
    };
    console.log(req.session.sauthUser);
    req.session.authUser.fullName = req.body.name;
    req.session.authUser.genderID = genderID;
    req.session.authUser.birthDate = req.body.birthday;
    req.session.authUser.address = req.body.address;
    const user = req.session.authUser;

    const rt = await userModel.changeInfoByEmail(entity, user.email);


    const Strname = user.fullName.split(' ');
    const name = Strname[Strname.length - 1];
    const gender = await userModel.getGender(user.genderID);
    const othergender = await userModel.getOtherGender(user.genderID);
    const dob = moment(user.birthDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
    res.render('vwProfile/infoProfile', {
        user,
        name,
        gender,
        other: othergender,
        dob
    });


});

router.get('/setting', restrict, function(req, res) {
    res.render('vwProfile/settingProfile');
});

router.post('/setting', async function(req, res) {
    const user = req.session.authUser;
    const rs = bcrypt.compareSync(req.body.currentPassword, user.password);

    if (rs === true) {
        const newPassword = bcrypt.hashSync(req.body.newPassword, config.authentication.salt);
        const rt = await userModel.changePasswordByEmail(user.email, newPassword);

    } else {
        console.log(false);
    }
    res.render('vwProfile/settingProfile');
})

router.get('/review', async function(req, res) {
    const user = req.query.id;
    const rows = await commentModel.allByUserID(user);

    res.render('vwProfile/review', {
        comments: rows,
        toID: user,
        empty: rows.length === 0,
    });
});

router.get('/add', restrict, async function(req, res) {
    const toID = req.query.id;
    const user = req.session.authUser;
    const name = await userModel.getUserByUserID(toID);

    res.render('vwProfile/add', {
        toName: name.fullName,
        fromName: user.fullName,
        toID,
        fromID: user.userID,
    });
})

router.post('/add', async function(req, res) {


    const entity = {
        fromID: req.body.fromID,
        toID: req.body.toID,
        comment: req.body.comment,
        like: req.body.like,
    };
    const count = await commentModel.checkSaved(req.body.fromID, req.body.toID, req.body.like);
    console.log(count);
    if (Number(count) < 1) {
        const rs = await commentModel.add(entity);
        console.log(rs);
    }
    res.redirect(`/profile/review?id=${req.body.toID}`);
})


router.get('/product-watch-list', async function(req, res) {
    const user = req.session.authUser;
    let id = user.userID;
    const total = await product.allWatchList(id);
    products = [];
    for (i = 0; i < total.length; i++) {
        const bidderName = await userModel.singleByID(total[i].bidderID);
        if (bidderName) {
            name = bidderName.fullName.split(' ');
            bidder = "******" + name[name.length - 1];
        } else {
            bidder = "N/A";
        }
        const item = {
            productID: total[i].productID,
            imageLink: total[i].imageLink,
            productName: total[i].productName,
            price: total[i].price,
            priceCurent: total[i].priceCurent,
            bidderID: total[i].bidderID,
            bidder,
            timePost: total[i].timePost,
            timeEnd: total[i].timeEnd
        }
        products.push(item);
    }
    res.render('vwProfile/productProfile', {
        products,
        empty: total.length === 0,
    })
})

router.get('/product-bidding-list', async function(req, res) {
    const user = req.session.authUser;
    let id = user.userID;
    const total = await product.allBiddingList(id);
    products = [];
    for (i = 0; i < total.length; i++) {
        const bidderName = await userModel.singleByID(total[i].bidderID);
        if (bidderName) {
            if (total[i].bidderID === id) {
                bidder = "Chúc mừng, bạn đang giữ mức giá cao nhất !";
            }
            else {
            name = bidderName.fullName.split(' ');
            bidder = "******" + name[name.length - 1];
            }
        } else {
            bidder = "N/A";
        }
        const item = {
            productID: total[i].productID,
            imageLink: total[i].imageLink,
            productName: total[i].productName,
            price: total[i].price,
            priceCurent: total[i].priceCurent,
            bidderID: total[i].bidderID,
            bidder,
            timePost: total[i].timePost,
            timeEnd: total[i].timeEnd
        }
        products.push(item);
    }
    res.render('vwProfile/productProfile2', {
        products,
        empty: total.length === 0,
    })
});

router.get('/product-won-list', async function(req, res) {
    const user = req.session.authUser;
    let id = user.userID;
    const total = await product.allWonList(id);
    products = [];
    for (i = 0; i < total.length; i++) {
        const bidderName = await userModel.singleByID(total[i].bidderID);
        if (bidderName) {
            name = bidderName.fullName.split(' ');
            bidder = "******" + name[name.length - 1];
        } else {
            bidder = "N/A";
        }
        const item = {
            productID: total[i].productID,
            imageLink: total[i].imageLink,
            productName: total[i].productName,
            price: total[i].price,
            priceCurent: total[i].priceCurent,
            bidderID: total[i].bidderID,
            bidder,
            timePost: total[i].timePost,
            timeEnd: total[i].timeEnd
        }
        products.push(item);
    }
    res.render('vwProfile/productProfile3', {
        products,
        empty: total.length === 0,
    })
});

router.get('/upgrade', restrict, async function(req, res) {
    const user = req.session.authUser;
    const entity = {
        bidderID: user.userID,
        accepted: 0
    };
    const count = requestModel.checkRequest(user.userID);
    if (Number(count) > 0) {
        const rs = await requestModel.add(entity);
    }
    res.redirect('/profile');
});
router.use(express.static('public'));
module.exports = router;