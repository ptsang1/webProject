const db = require("../utils/db");

module.exports = {
    all: _ => db.load('select * from USERS'),
    add: entity => db.add(entity, 'USERS'),
    confirmAccount: userID => db.updateValue("USERS", {accepted: 1}, {userID: userID}),
    isEmailExisted: async email => {
      let row = await db.load(`select email from USERS where email = '${email}`)
      if (email)
        return true;
      return false;
    },
    getUserByEmail: async email => {
        const rows = await db.load(`select * from USERS where email = '${email}'`);
        if (rows.length > 0)
          return rows[0];
        return null;
    },
    getUserByUserID: async userID => {
        const rows = await db.load(`select * from USERS where userID = '${userID}'`);
        if (rows.length > 0)
          return rows[0];
        return null;
    },
    acceptedUserByUserID: userID => db.load(`UPDATE USERS SET accepted = 1 WHERE userID='${userID}'`),
    acceptedUserByEmail: email => db.load(`UPDATE USERS SET accepted = 1 WHERE email= '${email}'`) 
}