const mysql = require('mysql');
const util = require('util');

const pool = mysql.createPool({
    connectionLimit: 100,
    host: 'webprojectdb.cemjothahgv9.ap-southeast-1.rds.amazonaws.com',
    port: 3306,
    user: 'ptsang',
    password: '123123123',
    database: 'webproject'
});

const pool_query = util.promisify(pool.query).bind(pool);
module.exports = {
    load: sql => pool_query(sql),
    add: (entity, table) => pool_query(`insert into ${table} set ?`, entity),
    del: (condition, table) => pool_query(`delete from ${table} where ?`, condition),
    patch: (entity, condition, table) => pool_query(`update ${table} set ? where ?`, [entity, condition]),
};