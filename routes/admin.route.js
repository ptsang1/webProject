const express = require('express');
const categoryModel = require('../models/category.model');
const acceptModel = require('../models/request.model');
const userModel = require('../models/user.model');
const config = require('../config/default.json');
const router = express.Router();

router.use(express.static('public'));

router.get('/', async function(req, res) {
    const results = await categoryModel.all();

    res.render('vwAdmin/vwCategories/index', {
        layout: 'admin.hbs',
        categories: results,
        empty: results.length === 0
    });
});

router.get('/categories', async function(req, res) {
    const results = await categoryModel.all();

    res.render('vwAdmin/vwCategories/index', {
        layout: 'admin.hbs',
        categories: results,
        empty: results.length === 0
    });
});

router.get('/categories/add', function(req, res) {
    res.render('vwAdmin/vwCategories/add', {
        layout: 'admin.hbs'
    });
})
router.post('/categories/add', async function(req, res) {
    const entity = {
        CatName: req.body.CatName
    }
    const rs = await categoryModel.add(entity);
    res.render('vwAdmin/vwCategories/add', {
        layout: 'admin.hbs'
    });
})
router.get('/categories/edit/:catId', async function(req, res) {
    const category = await categoryModel.single(req.params.catId);
    if (category === null) throw new Error('Invalid Parameter');
    res.render('vwAdmin/vwCategories/edit', {
        layout: 'admin.hbs',
        category
    });
})

router.post('/categories/update', async function(req, res) {

    const rs = await categoryModel.patch(req.body);

    res.redirect('/admin/categories');
})
router.post('/categories/del', async function(req, res) {
    const rs = await categoryModel.del(req.body.catID);
    console.log(req.body.catID);
    res.redirect('/admin/categories');
})

router.get('/accepts', async function(req, res) {
    const results = await acceptModel.all();

    res.render('vwAdmin/vwAccept/index', {
        layout: 'admin.hbs',
        users: results,
        empty: results.length === 0
    });
});
router.get('/accepts/:bidderID', async function(req, res) {
    const rt = req.query.res;
    console.log(req.params.bidderID);
    if (rt === '1') {
        const rs = await userModel.acceptedUserByUserID(req.params.bidderID);
    }
    const ra = await acceptModel.del(req.params.bidderID);
    res.redirect('/admin/accepts');
})


router.get('/users', async function(req, res) {
    const results = await userModel.all();
    console.log(results);
    res.render('vwAdmin/vwUser/index', {
        layout: 'admin.hbs',
        users: results,
        empty: results.length === 0
    });
});
router.get('/users/edit/:userID', async function(req, res) {
    const user = await userModel.getUserByUserID(req.params.userID);
    if (user === null) throw new Error('Invalid Parameter');
    res.render('vwAdmin/vwUser/edit', {
        layout: 'admin.hbs',
        user
    });
})
router.post('/users/update', async function(req, res) {

    const rs = await userModel.patch(req.body);

    res.redirect('/admin/users');
})
router.post('/users/del', async function(req, res) {
    const rs = await userModel.del(req.body.userID);
    res.redirect('/admin/users');
})

module.exports = router;