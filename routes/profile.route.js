const express = require('express');
const router = express.Router();


router.get('/', function(req, res) {
    res.render('vwProfile/infoProfile');
});
router.get('/info', function(req, res) {
    res.render('vwProfile/infoProfile');
});
router.get('/settingProfile', function(req, res) {
    res.render('vwProfile/settingProfile');
});
router.get('/productProfile', function(req, res) {
    res.render('vwProfile/productProfile');
});
router.use(express.static('public'));
module.exports = router;