const db = require("../utils/db");

module.exports = {
    all: _ => db.load('select * from USERS'),
    add: entity => db.add(entity, 'USERS'),
    getUserByEmail: async email => {
        const rows = await db.load(`select * from users_clc where email = '${email}'`);
        if (rows.length > 0)
            return rows[0];
        return null;
    },
    getUserByUserID: async userID => {
        const rows = await db.load(`select * from users_clc where userID = '${userID}'`);
        if (rows.length > 0)
            return rows[0];
        return null;
    },
    acceptedUserByUserID: userID => db.load(`UPDATE USERS SET accepted = 1 WHERE userID='${userID}'`),
    acceptedUserByEmail: email => db.load(`UPDATE USERS SET accepted = 1 WHERE email= '${email}'`),
    singleByEmail: async email => {
        const rows = await db.load(`select * from USERS where email = '${email}'`);
        if (rows.length > 0)
            return rows[0];
        return null;
    },
    getGender: async id => {
        const rows = await db.load(`select * from GENDERS where genderID = ${id}`);
        if (rows.length === 0)
            return null;
        return rows[0];
    },
    changePasswordByEmail: (email, password) => db.load(`UPDATE USERS SET password = '${password}' WHERE email= '${email}'`),

}