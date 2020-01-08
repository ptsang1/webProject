const db = require("../utils/db");
const config = require('../config/default.json');

module.exports = {
    all: _ => db.load('select * from PRODUCTS'),
    allSellProduct: userID => db.load(`select * from PRODUCTS p join USERS u on u.userID = p.sellerID join PRODUCT_IMAGES pi on pi.productID = p.productID where u.userID = '${userID}' group by p.productID`),
    allWatchList: id => db.load(`select * from USERS u join PRODUCTS_SAVED ps on u.userID = ps.userID 
    join PRODUCT_IMAGES pi on pi.productID = ps.productID 
    join PRODUCTS p on p.productID = pi.productID 
    WHERE u.userID = '${id}'
    GROUP BY p.productID`),
    allBiddingList: id => db.load(`select * from USERS u join AUCTION_HISTORIES ah on u.userID = ah.bidderID 
    join PRODUCT_IMAGES pi on pi.productID = ah.productID 
    join PRODUCTS p on p.productID = pi.productID 
    WHERE u.userID = '${id}' GROUP BY p.productID`),
    allWonList: id => db.load(`select * from PRODUCTS p join PRODUCT_IMAGES pi on pi.productID = p.productID
    WHERE p.bidderID = '${id}' and p.sold = 1 GROUP BY p.productID`),
    add: entity => db.add(entity, 'PRODUCTS'),
    saved: entity => db.add(entity, 'PRODUCTS_SAVED'),
    checkSaved: async(sellerID, bidderID, productID) => {
        const rows = await db.load(`select count(*) as total  from PRODUCTS_SAVED where userID = '${bidderID}' and sellerID = '${sellerID}' and productID = ${productID}`);
        return rows[0].total;
    },
    bidded: entity => db.add(entity, 'AUCTION_HISTORIES'),
    saveBidPrice: (price, productID, bidderID) => db.load(`UPDATE PRODUCTS SET priceCurent = ${price}, bidderID='${bidderID}' WHERE productID='${productID}'`),
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