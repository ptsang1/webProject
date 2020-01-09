const db = require('../utils/db');

module.exports = {
    allByUserID: userID => db.load(`select u.fullName as toName,
    s.fullName as fromName,
    c.like,
    c.comment
    from COMMENTS c 
    JOIN USERS u on u.userID=c.toID 
    JOIN USERS s on s.userID = c.fromID
    where toID =  '${userID}'`),
    checkSaved: async(fromID, toID, like) => {
        const rows = await db.load(`select count(*) as total  from COMMENTS c where c.fromID = '${fromID}' and c.toID = '${toID}' and c.like = ${like}`);
        return rows[0].total;
    },
    single: async id => {
        const sql = `select * from COMMENTS where toID = ${id}`;
        const rows = await db.load(sql);
        if (rows.length === 0)
            return null;

        return rows[0];
    },
    add: entity => db.add(entity, 'COMMENTS'),
    del: id => db.del({ toID: id }, 'COMMENTS'),
};