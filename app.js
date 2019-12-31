const express = require('express');
const exphbs = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');
// const uuidv1 = require('uuid/v1');
// const bcrypt = require('bcryptjs');
// const db = require("./utils/db");
// const config = require("./config/default.json");
// const user = require("./models/user.model")
const product = require("./models/product.model")

require('express-async-errors');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({
    extended: true
}));
// app.use(express.static('utils'));
// app.use(express.static('routes'));

app.engine('hbs', exphbs({
    defaultLayout: 'main.hbs',
    helpers: {
        section: hbs_sections()
            // format: val => numeral(val).format('0.0')
    }
}));

app.set('view engine', 'hbs');

app.get('/',async function(req, res) {
    result = await product.all();
    res.render('home', {
        products: result,
        empty: result.length === 0,
    });
    //console.log(await product.all())
    // const fn_done = results => console.log(results);
    // db.load('select * from GENDERS', fn_done);
    // const password_hash = bcrypt.hashSync("123456", config.authentication.salt);
    // const newUser = {
    //     userID: uuidv1(),
    //     email: "seller@gmail.com",
    //     password: password_hash,
    //     fullName: "seller",
    //     birthDate: "1999-30-05",
    //     address: "address",
    //     genderID: 1,
    //     roleID: 2,
    //     accepted: 1,
    //     avatar: "",
    // }
    // user.add(newUser);
    //res.render('home');
});

app.get('/login', function(req, res) {
    res.render('login', { layout: 'signin_signup.hbs', template: 'signin.hbs' });
});

app.get('/forgottenPassword', function(req, res) {
    res.render('forgottenPassword', { layout: 'signin_signup.hbs', template: 'signin.hbs' });
});

app.get('/laptop-list', function(req, res) {
    res.render('laptop-list');
});

app.get('/phone-list', function(req, res) {
    res.render('phone-list');
});

app.get('/tablet-list', function(req, res) {
    res.render('tablet-list');
});

app.get('/detail', function(req, res) {
    res.render('detail');
});

app.get('/add', function(req, res) {
    res.render('add');
});

app.use('/signup', require('./routes/signup.route'));
app.use('/profile', require('./routes/profile.route'));
//app.use('/', require('./routes/product.route'));

app.get('/err', function(req, res) {
    throw new Error('beng beng');
});

app.get('/about', function(req, res) {
    res.render('about');
});

app.use(function(req, res) {
    res.render('404', {
        layout: false
    });
})

app.use(function(err, req, res, next) {
    console.log(err);
    res.send('error');
})

const PORT = 3000;
app.listen(PORT, function() {
    console.log(`Server is running at http://localhost:${PORT}`);
});