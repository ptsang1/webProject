var express = require('express');
var exphbs = require('express-handlebars');

var app = express();

app.use(express.static('public'))

app.engine('hbs', exphbs({
    defaultLayout: 'main.hbs'
}));

app.set('view engine', 'hbs');

app.get('/', function(req, res){
    res.render('home');
});

const PORT = 3000;
app.listen(PORT, function(){
    console.log(`Server is running at http://localhost:${PORT}`);
});