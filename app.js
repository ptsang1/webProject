const express = require('express');
const exphbs = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');
const numeral = require('numeral');
const moment = require('moment');
// const uuidv1 = require('uuid/v1');
// const bcrypt = require('bcryptjs');
// const db = require("./utils/db");
// const config = require("./config/default.json");
// const user = require("./models/user.model")
const product = require("./models/product.model")

require('express-async-errors');

const app = express();


app.use(express.urlencoded({
    extended: true
}));
// app.use(express.static('utils'));
// app.use(express.static('routes'));

app.engine('hbs', exphbs({
    defaultLayout: 'main.hbs',
    helpers: {
        section: hbs_sections(),
        format: val => numeral(val).format('0,0'),
        formatDate: val => moment(val).format('h:mm:ss a, DD/MM/YYYY'),
        formatTime: val => moment(val).fromNow(),
    }
}));

app.set('view engine', 'hbs');

// hỗ trợ show danh mục trên nav bar và trang xem danh sách sản phẩm
const categoryModel = require('./models/category.model');
app.use(async function(req, res, next) {
    const rows = await categoryModel.allWithDetails();
    res.locals.lcCategories = rows;
    next();
});
//--------------------------------------------------------------------

app.use('/', require('./routes/product.route'));
app.use('/product', require('./routes/_product.route'));
app.use('/account', require('./routes/account.route'));
app.use('/profile', require('./routes/profile.route'));
app.use('/admin', require('./routes/admin.route'));

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