const categoryModel = require('../models/category.model');

module.exports = function(app) {
    app.use(async function(req, res, next) {
        if (req.session.isAuthenticated === null) {
            req.session.isAuthenticated = false;
        }

        // req.session.isAuthenticated = req.session.passport.user != null;
        // req.session.authUser = req.session.passport.user;

        res.locals.lcIsAuthenticated = req.session.isAuthenticated;
        res.locals.lcAuthUser = req.session.authUser;
        // res.locals.lcAuthUser = req.session.passport.user;
        if (req.session.authUser) {
            res.locals.isSeller = req.session.authUser.roleID === 2;
            res.locals.isAdmin = req.session.authUser.roleID === 3;
        }
        next();
    })

    app.use(async function(req, res, next) {
        const rows = await categoryModel.allWithDetails();
        res.locals.lcCategories = rows;
        next();
    })
};