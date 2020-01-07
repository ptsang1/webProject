const exphbs = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');
const numeral = require('numeral');
const moment = require("moment");

module.exports = function (app) {
    app.engine('hbs', exphbs({
        defaultLayout: 'main.hbs',
        helpers: {
            section: hbs_sections(),
            format: val => numeral(val).format('0,0'),
            formatDate: val => moment(val).format('h:mm:ss a, DD/MM/YYYY')
        }
    }));
    app.set('view engine', 'hbs');

};
