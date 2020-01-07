const db = require('../utils/db');

module.exports = {
    single: async id => {
        const sql = `select * from PRODUCT_IMAGES where productID = ${id}`;
        const rows = await db.load(sql);
        if (rows.length === 0)
            return null;

        return rows[0];
    },
    add: entity => db.add(entity, 'PRODUCT_IMAGES'),
    del: id => db.del({ sellerID: id }, 'PRODUCT_IMAGES'),
};