const db = require('../utils/db');

module.exports = {
    single: async id => {
        const sql = `select * from PRODUCT_DESCRIPTIONS where productID = ${id}`;
        const rows = await db.load(sql);
        if (rows.length === 0)
            return null;

        return rows[0];
    },
    add: entity => db.add(entity, 'PRODUCT_DESCRIPTIONS'),
    del: id => db.del({ bidderID: id }, 'PRODUCT_DESCRIPTIONS'),
};