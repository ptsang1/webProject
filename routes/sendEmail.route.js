const nodemailer = require("nodemailer");
const USERS = require("../models/user.model");
const PRODUCTS = require("../models/product.model");
const fs = require('fs');
const express = require('express');
const router = express.Router();
const path = require('path');
const handlebars = require('handlebars');
const uuidv1 = require('uuid/v1');
const smtpTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: 'phasamique@gmail.com',
        pass: '695930599'
    }
});

router.get('/confirmEmail', function(req, res) {
    const link = "http://" + req.get('host') + `/sendEmail/verifyConfirmEmail?id=${req.query.id}`;
    replacements = {
        fullname: req.query.fullname,
        email: req.query.to,
        confirm_url: link
    };
    let reqPath = path.join(__dirname, '../');
    const mailOptions = {
        from: 'phasamique@gmail.com',
        to: req.query.to,
        subject: "Xác nhận email từ Phasamique",
        html: render(reqPath + '\\views\\email\\email.html', replacements)
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
            console.log(error);
            res.end("error");
        } else {
            console.log("Message sent: " + response.message);
            res.end("sent");
        }
    });
    res.redirect('/');
});

router.get('/announceProductPriceUpdating', async function(req, res) {
    // const link = "http://" + req.get('host') + `/sendEmail/verifyConfirmEmail?id=${req.query.id}`;
    let user = await USERS.getUserByUserID(req.query.to);
    const product = await PRODUCTS.singleByID(req.query.product);
    let Seller = await USERS.getUserByUserID(product.sellerID);
    sendMail({to: user.email, 
              subject: "Bạn đã đấu giá thành công sản phẩm từ Phasamique",
              emailNameFile: 'bidSuccessBidder.html',
              replacements: {
                                fullname: user.fullName,
                                product_name: product.productName,
                                seller: Seller.fullName,
                                price: product.priceCurent,
                                deadline: product.timeEnd,
                            }});
    sendMail({to: Seller.email, 
        subject: "Thông báo cập nhập giá sản phẩm của bạn từ Phasamique",
        emailNameFile: 'bidSuccessSeller.html',
        replacements: {
                        fullname: Seller.fullName,
                        product_name: product.productName,
                        bidder: user.fullName,
                        price: product.priceCurent,
                        deadline: product.timeEnd,
                    }});
    if (product.bidderID != null && product.bidderID != user.userID){
        let preBidder = await USERS.getUserByUserID(product.bidderID);
        sendMail({to: preBidder.email, 
            subject: "Thông báo cập nhập giá sản phẩm bạn đã đấu giá từ Phasamique",
            emailNameFile: 'bidSuccessPrevBidder.html',
            replacements: {
                              fullname: preBidder.fullName,
                              product_name: product.productName,
                              seller: Seller.fullName,
                              price: product.priceCurent,
                              deadline: product.timeEnd,
                          }});
    }
    res.redirect(`/product/detail?id=${product.productID}`);
});

router.get('/verifyConfirmEmail', async function(req, res) {
    console.log(req.protocol + ":/" + req.get('host'));
    if ((req.protocol + "://" + req.get('host')) == ("http://" + req.get('host'))) {
        console.log("Domain is matched. Information is from Authentic email");
        user = await USERS.getUserByUserID(req.query.id)
        if (user) {
            console.log("email is verified");
            await USERS.acceptedUserByUserID(user.userID);
            await USERS.changeUserID(user.userID, uuidv1());

        } else {
            console.log("something is wrong");
            return res.redirect('/1234567890');
        }
    }
    res.redirect('/');
});

function render(filename, data) {
    var source = fs.readFileSync(filename, 'utf8').toString();
    var template = handlebars.compile(source);
    var output = template(data);
    return output;
}

function sendMail(option){
    let reqPath = path.join(__dirname, '../');

    const mailOptions = {
        from: 'phasamique@gmail.com',
        to: option.to,
        subject: option.subject,
        html: render(reqPath + `\\views\\email\\${option.emailNameFile}`, option.replacements)
    }

    smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
            console.log(error);
            res.end("error");
        } else {
            console.log("Message sent: " + response.message);
            res.end("sent");
        }
    });
}

module.exports = router;