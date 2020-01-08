const db = require("../utils/db");
const config = require('../config/default.json');

module.exports = {
    all: _ => db.load('select * from PRODUCTS'),
    add: entity => db.add(entity, 'PRODUCTS'),
    saved: entity => db.add(entity, 'PRODUCTS_SAVED'),
    allByCat: catId => db.load(`select * from PRODUCTS where catID = ${catId}`),
    countByCat: async catId => {
        const rows = await db.load(`select count(*) as total  from PRODUCTS where catID = ${catId}`);
        return rows[0].total;
    },
    pageByCatOrderValueASC: (catId, offset) => db.load(`select * from PRODUCTS p join PRODUCT_IMAGES pi on pi.productID = p.productID
    where catID = ${catId} GROUP BY p.productID  ORDER BY priceCurent ASC limit ${config.pagination.limit} offset ${offset}`),
    pageByCatOrderValueDESC: (catId, offset) => db.load(`select * from PRODUCTS p join PRODUCT_IMAGES pi on pi.productID = p.productID
    where catID = ${catId} GROUP BY p.productID ORDER BY priceCurent DESC limit ${config.pagination.limit} offset ${offset}`),
    pageByCatOrderTimeASC: (catId, offset) => db.load(`select * from PRODUCTS p join PRODUCT_IMAGES pi on pi.productID = p.productID
    where catID = ${catId} GROUP BY p.productID ORDER BY timeEnd ASC limit ${config.pagination.limit} offset ${offset}`),
    pageByCatOrderTimeDESC: (catId, offset) => db.load(`select * from PRODUCTS p join PRODUCT_IMAGES pi on pi.productID = p.productID
    where catID = ${catId} GROUP BY p.productID ORDER BY timeEnd DESC limit ${config.pagination.limit} offset ${offset}`),
    topFiveProductEnd: _ => db.load(`select * 
    from (select * from PRODUCTS c ORDER BY timeEnd ASC LIMIT 5) as ta RIGHT JOIN PRODUCT_IMAGES pi on pi.productID = ta.productID
		GROUP BY pi.productID
    ORDER BY timeEnd DESC ;`),
    topFiveProductStar: _ => db.load(`
          SELECT
          p.productID,
          p.productName,
          COUNT(a.bidderID) AS amount,
          a.bidderID,
          pi.imageLink
          FROM PRODUCTS p
          LEFT OUTER JOIN AUCTION_HISTORIES a ON a.productID = p.productID
          LEFT OUTER JOIN PRODUCT_IMAGES pi ON pi.productID = p.productID
          GROUP BY (p.productID)
          ORDER BY amount DESC; `),
    topFiveProductValue: _ => db.load(`
    SELECT * 
    from PRODUCTS p join PRODUCT_IMAGES pi on pi.productID = p.productID
    GROUP BY p.productID
    ORDER BY p.priceCurent DESC 
    limit 5;
                `),
    singleByID: productID => db.load(`
            select * 
            from PRODUCTS
            where productID = ${productID}
                `),
    timeSingleByID: productID => db.load(`
                SELECT(TIME_TO_SEC(timeEnd) - TIME_TO_SEC(timePost)) as time from PRODUCTS where productID = ${productID}
                `),
    getNextID: _ => db.load(`
                SELECT AUTO_INCREMENT as number FROM information_schema.TABLES WHERE TABLE_SCHEMA = "webproject"
                AND TABLE_NAME = "PRODUCTS"
                `),

}