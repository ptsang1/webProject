const db = require('../utils/db');

module.exports = {
    all: _ => db.load('select * from REQUESTS_UPGRADE_ACCOUNT r join USERS u on u.userID = r.bidderID WHERE r.accepted =0;'),
    single: async id => {
        const sql = `select * from REQUESTS_UPGRADE_ACCOUNT where bidderID = ${id}`;
        const rows = await db.load(sql);
        if (rows.length === 0)
            return null;

        return rows[0];
    },
    checkRequest: async userID => {
        const rows = await db.load(`select count(*) as total  from REQUESTS_UPGRADE_ACCOUNT where userID = '${userID}'`);
        return rows[0].total;
    },
    add: entity => db.add(entity, 'REQUESTS_UPGRADE_ACCOUNT'),
    del: id => db.del({ bidderID: id }, 'REQUESTS_UPGRADE_ACCOUNT'),
};