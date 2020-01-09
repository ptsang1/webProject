const db = require('../utils/db');

module.exports = {
    allByProductID: productID => db.load(`select u.fullName,a.offer,a.timeOffer from AUCTION_HISTORIES a join USERS u  on u.userID = a.bidderID where a.productID = ${productID}`),
    single: async id => {
        const sql = `select * from AUCTION_HISTORIES where productID = ${id}`;
        const rows = await db.load(sql);
        if (rows.length === 0)
            return null;

        return rows[0];
    },
    removeHistoryAuction: async (bidderID, productID) => {
        await db.load('DELETE FROM AUCTION_HISTORIES WHERE bidderID=? and productID=?;', [bidderID, productID]);
    },
    listBidder: productID => db.load(`select distinct u.fullName, u.email from AUCTION_HISTORIES a join USERS u on u.userID = a.bidderID where a.productID = ${productID}`),
    add: entity => db.add(entity, 'AUCTION_HISTORIES'),
    del: id => db.del({ sellerID: id }, 'AUCTION_HISTORIES'),
    getHighest: async productID => {
        let row = await db.load('SELECT bidderID, offer FROM AUCTION_HISTORIES WHERE productID=? ORDER BY offer DESC limit 1;', [productID]);
        if (row.length > 0)
            return row[0];
        return null;
    }
};