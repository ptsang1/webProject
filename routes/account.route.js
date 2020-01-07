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

router.post('/signup', async function(req, res){
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
    res.redirect(`/account/send?fullname=${newUser.fullName}&to=${newUser.email}`);
});

router.get('/is-available', async function (req, res) {
    // const email = CryptoJS.AES.decrypt(, 'ptSang').toString(CryptoJS.enc.Utf8);
    const check = await USERS.isEmailExisted(req.query.email);
    if (check){
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
    if (user === null){
        return res.render('vwAccount/login', {
            layout: 'signin_signup.hbs',
            template: 'signup',
            err_message: 'Email hoặc password bạn nhập đã không đúng.'
        });
    }

    const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (isPasswordCorrect === false){
        return res.render('vwAccount/login', {
            layout: 'signin_signup.hbs',
            template: 'signup',
            err_message: 'Email hoặc password bạn nhập đã không đúng.'
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

function render(filename, data)
{
  var source = fs.readFileSync(filename,'utf8').toString();
  var template = handlebars.compile(source);
  var output = template(data);
  return output;
}
const rand=Math.floor((Math.random() * 100) + 54);
router.get('/send',function(req,res){
    const link="http://"+req.get('host')+`/account/verify?id=${rand}&email=${req.query.to}`;
    replacements = {
        fullname: req.query.fullname,
        email: req.query.to,
        confirm_url: link
    };
    let reqPath = path.join(__dirname, '../');
    const mailOptions={
        from: 'phasamique@gmail.com',
        to : req.query.to,
        subject : "Xác nhận email từ Phasamique",
        html : render(reqPath + '\\views\\email\\email.html', replacements)
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
            res.end("error");
        }else{
            console.log("Message sent: " + response.message);
            res.end("sent");
        }
    });
    res.redirect('/');
});

router.get('/verify',function(req,res){
    console.log(req.protocol+":/"+req.get('host'));
    if((req.protocol+"://"+req.get('host'))==("http://"+req.get('host')))
    {
        console.log("Domain is matched. Information is from Authentic email");
        if(req.query.id==rand)
        {
            console.log("email is verified");
            USERS.acceptedUserByEmail(req.query.email);
            
        }else{
            console.log("email is not verified");
            return res.redirect('/');
        }
    }
    res.redirect('/');
});

module.exports = router;