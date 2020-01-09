const db = require('../utils/db');

module.exports = {
    add: async entity => await db.add(entity, 'BANNED_BIDDERS'),
    check: async (bidderID, productID)=>{
        let row = await db.load('SELECT bidderID FROM BANNED_BIDDERS where bidderID=? and productID=?', [bidderID, productID]);
        return row.length > 0;
    }
};