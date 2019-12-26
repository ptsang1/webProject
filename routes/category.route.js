const express = require('express');
const categoryModel = require('../models/category.model');

const router = express.Router();

router.get('/', async function(req, res) {
    const results = await categoryModel.all();
    res.render('vwCategories/index', {
        categories: results,
        empty: results.length === 0
    });
})

router.get('/add', function(req, res) {
    res.render('vwCategories/add');
})

router.post('/add', async function(req, res) {
    // console.log(req.body);
    // res.send('end');

    // const entity = {
    //   CatName: req.body.txtCatName
    // }
    const rs = await categoryModel.add(req.body);
    console.log(rs);
    res.render('vwCategories/add');
})

router.get('/edit/:catId', async function(req, res) {
    const category = await categoryModel.single(req.params.catId);
    if (category === null)
        throw new Error('Invalid parameter.');

    res.render('vwCategories/edit', {
        category
    });
})

router.post('/update', async function(req, res) {
    const rs = await categoryModel.patch(req.body);
    // console.log(rs);
    res.redirect('/admin/categories');
})

router.post('/del', async function(req, res) {
    const rs = await categoryModel.del(req.body.CatID);
    // console.log(rs);
    res.redirect('/admin/categories');
})

module.exports = router;