const express = require('express');
require('express-async-errors');
// const passport = require('passport');

const app = express();

app.use(express.urlencoded({
    extended: true
}));

app.use('/public', express.static('public'));

require('./middlewares/session.mdw')(app);
require('./middlewares/view.mdw')(app);

require('./middlewares/locals.mdw')(app);
require('./middlewares/routes.mdw')(app);
require('./middlewares/error.mdw')(app);
// require('./middlewares/passport.mdw')(app, passport);

const PORT = 3000;
app.listen(PORT, function() {
    console.log(`Server is running at http://localhost:${PORT}`);
});