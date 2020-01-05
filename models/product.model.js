const db = require("../utils/db");

module.exports = {
    all: _ => db.load('select * from PRODUCTS'),
    add: entity => db.add(entity, 'PRODUCTS'),
    topFiveProductEnd: _ => db.load(`select *
    from (select * from PRODUCTS c ORDER BY timeEnd ASC LIMIT 5) as ta
    ORDER BY timeEnd DESC;`),
    topFiveProductStar: _ => db.load(`select p.productID, a.bidderID, count(a.bidderID) as amount
    from PRODUCTS p join AUCTION_HISTORIES a on a.productID=p.productID
    GROUP BY (a.bidderID)
    ORDER BY amount DESC `),
    topFiveProductValue: _ => db.load(`SELECT * from PRODUCTS p ORDER BY p.priceCurent DESC limit 5;`),

}