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
    add: entity => db.add(entity, 'AUCTION_HISTORIES'),
    del: id => db.del({ sellerID: id }, 'AUCTION_HISTORIES'),
};