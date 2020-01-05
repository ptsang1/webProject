const db = require('../utils/db');

module.exports = {
    all: _ => db.load('select * from CATEGORIES'),
    allWithDetails: _ => {
        const sql = `
      select c.CatID, c.CatName, count(p.ProductID) as num_of_products
      from CATEGORIES c left join PRODUCTS p on c.CatID = p.CatID
      group by c.CatID, c.CatName
    `;
        return db.load(sql);
    },

    single: async id => {
        const sql = `select * from categories where CatID = ${id}`;
        const rows = await db.load(sql);
        if (rows.length === 0)
            return null;

        return rows[0];
    },
    singleByName: async catName => {
        const sql = `select * from CATEGORIES where catName = "${catName}"`;
        const rows = await db.load(sql);
        if (rows.length === 0)
            return null;
        return rows[0];
    },
    add: entity => db.add(entity, 'categories'),
    del: id => db.del({ CatID: id }, 'categories'),
    patch: entity => {
        const condition = { CatID: entity.CatID };
        delete entity.CatID;
        return db.patch(entity, condition, 'categories');
    }
};