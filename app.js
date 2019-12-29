const express = require('express');
const exphbs = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');
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

app.get('/', function(req, res) {
    // const fn_done = results => console.log(results);
    // db.load('select * from ROLES', fn_done);
    res.render('home');
});

app.get('/login', function(req, res) {
    res.render('login', { layout: 'signin_signup.hbs', template: 'signin.hbs' });
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

app.use('/signup', require('./routes/signup.route'))

app.get('/err', function(req, res) {
    throw new Error('beng beng');
})

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