module.exports = function(app) {


    app.get('/about', function(req, res) {
        res.render('about');
    })

    app.use('/', require('../routes/product.route'));
    app.use('/product', require('../routes/_product.route'));
    app.use('/account', require('../routes/account.route'));
    app.use('/profile', require('../routes/profile.route'));
};