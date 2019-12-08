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
    res.render('login');
});
app.get('/register', function(req, res) {
    res.render('register');
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