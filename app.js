var express = require('express');
var exphbs = require('express-handlebars');

var app = express();

app.use(express.static('public'))

app.engine('hbs', exphbs({
    defaultLayout: 'main.hbs'
}));

app.set('view engine', 'hbs');

app.get('/', function(req, res) {
    res.render('home');
});

app.get('/login', function(req, res) {
    res.render('login', {layout: false});
});

app.get('/signup', function(req, res) {
    res.render('register', {layout: false});
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
app.get('/about', function(req, res) {
    res.render('about');
});
app.use(function(req, res) {
    res.render('404', {
        layout: false
    });
})

const PORT = 3000;
app.listen(PORT, function() {
    console.log(`Server is running at http://localhost:${PORT}`);
});