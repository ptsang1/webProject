const express = require('express'),
    uuidv1 = require('uuid/v1'),
    bcrypt = require('bcryptjs'),
    db = require("../utils/db"),
    config = require("../config/default.json"),
    nodemailer = require("nodemailer"),
    USERS = require("../models/user.model"),
    path = require('path'),
    handlebars = require('handlebars');

const router = express.Router();

router.use(express.static('public'));

const smtpTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: 'phasamique@gmail.com',
        pass: '695930599'
    }
});

router.get('/signup', async function(req, res) {
    _gender = await db.load('select * from GENDERS');
    await res.render('vwAccount/register', {
        layout: 'signin_signup.hbs',
        template: 'signup',
        genders: _gender,
        empty: _gender.length === 0,
    });
});

router.post('/signup', async function(req, res) {
    const password_hash = bcrypt.hashSync(req.body.password, config.authentication.salt);
    const newUser = {
        userID: uuidv1(),
        email: req.body.email,
        password: password_hash,
        fullName: req.body.name,
        birthDate: req.body.birthday,
        address: req.body.address,
        genderID: req.body.gender,
        roleID: 1,
        accepted: 0,
        avatar: "",
    }
    USERS.add(newUser);
    res.redirect(`/account/send?fullname=${newUser.fullName}&to=${newUser.email}&id=${newUser.userID}`);
});

router.get('/is-available', async function(req, res) {
    // const email = CryptoJS.AES.decrypt(, 'ptSang').toString(CryptoJS.enc.Utf8);
    const check = await USERS.isEmailExisted(req.query.email);
    if (check) {
        return res.json("Email này đã được đăng ký rồi nè!");
    }
    res.json("");
});

router.get('/login', function(req, res) {
    res.render('vwAccount/login', {
        layout: 'signin_signup.hbs',
        template: 'signup',
    });
});

router.post('/logout', function(req, res) {
    req.session.isAuthenticated = false;
    req.session.authUser = null;

    res.redirect('/');
});

router.post('/login', async function(req, res) {
    user = await USERS.getUserByEmail(req.body.email);
    if (user === null) {
        return res.render('vwAccount/login', {
            layout: 'signin_signup.hbs',
            template: 'signup',
            err_message: 'Email hoặc password bạn nhập đã không đúng.'
        });
    }

    const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (isPasswordCorrect === false) {
        return res.render('vwAccount/login', {
            layout: 'signin_signup.hbs',
            template: 'signup',
            err_message: 'Email hoặc password bạn nhập đã không đúng.'
        });
    }

    let check = await USERS.isUserAccepted(user.email);

    if (!check) {
        return res.render('vwAccount/login', {
            layout: 'signin_signup.hbs',
            template: 'signup',
            err_message: 'Tài khoản của bạn chưa được xác nhận. Hãy kiểm tra email và xác nhận tài khoản để đăng nhập nhé!'
        });
    }

    delete user.password_hash;
    req.session.isAuthenticated = true;
    req.session.authUser = user;
    const url = req.query.retUrl || '/';
    res.redirect(url);

    // res.redirect('/');
});

router.get('/forgottenPassword', function(req, res) {
    res.render('vwAccount/forgottenPassword', {
        layout: 'signin_signup.hbs',
        template: 'signup',
    });
});

const fs = require('fs');

function render(filename, data) {
    var source = fs.readFileSync(filename, 'utf8').toString();
    var template = handlebars.compile(source);
    var output = template(data);
    return output;
}

router.get('/send', function(req, res) {
    const link = "http://" + req.get('host') + `/account/verify?id=${req.query.id}`;
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

router.get('/verify', async function(req, res) {
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

module.exports = router;