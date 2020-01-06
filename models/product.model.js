const db = require("../utils/db");
const config = require('../config/default.json');

module.exports = {
    all: _ => db.load('select * from PRODUCTS'),
    add: entity => db.add(entity, 'PRODUCTS'),
    allByCat: catId => db.load(`select * from PRODUCTS where catID = ${catId}`),
    countByCat: async catId => {
        const rows = await db.load(`select count(*) as total  from PRODUCTS where catID = ${catId}`);
        return rows[0].total;
    },
    pageByCatOrderValueASC: (catId, offset) => db.load(`select * from PRODUCTS where catID = ${catId} ORDER BY priceCurent ASC limit ${config.pagination.limit} offset ${offset}`),
    pageByCatOrderValueDESC: (catId, offset) => db.load(`select * from PRODUCTS where catID = ${catId} ORDER BY priceCurent DESC limit ${config.pagination.limit} offset ${offset}`),
    pageByCatOrderTimeASC: (catId, offset) => db.load(`select * from PRODUCTS where catID = ${catId} ORDER BY timeEnd ASC limit ${config.pagination.limit} offset ${offset}`),
    pageByCatOrderTimeDESC: (catId, offset) => db.load(`select * from PRODUCTS where catID = ${catId} ORDER BY timeEnd DESC limit ${config.pagination.limit} offset ${offset}`),
    topFiveProductEnd: _ => db.load(`select *
    from (select * from PRODUCTS c ORDER BY timeEnd ASC LIMIT 5) as ta
    ORDER BY timeEnd DESC;`),
    topFiveProductStar: _ => db.load(`select p.productID, a.bidderID, count(a.bidderID) as amount
    from PRODUCTS p join AUCTION_HISTORIES a on a.productID=p.productID
    GROUP BY (a.bidderID)
    ORDER BY amount DESC `),
    topFiveProductValue: _ => db.load(`SELECT * from PRODUCTS p ORDER BY p.priceCurent DESC limit 5;`),
    singleByID: productID => db.load(`select * from PRODUCTS where productID = ${productID}`),
    timeSingleByID: productID => db.load(`SELECT (TIME_TO_SEC(timeEnd)-TIME_TO_SEC(timePost)) as time from PRODUCTS where productID = ${productID}`),
}