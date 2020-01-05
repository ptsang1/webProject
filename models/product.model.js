const db = require("../utils/db");

module.exports = {
    all: _ => db.load('select * from PRODUCTS'),
    add: entity => db.add(entity, 'PRODUCTS'),
}