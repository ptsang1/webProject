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
    load: query => pool_query(query),
    add: (entity, table) => pool_query(`insert into ${table} set ?`, entity),
    // load: (queryString, fn_done) => {
    //     connection.connect();
    //     connection.query(queryString, function(error, results, fields) {
    //         if (error)
    //             throw error;
            
    //         console.log(results);

    //         fn_done(results);
    //         connection.end();
    //     });
    // }
};
    // load: sql => pool_query(sql),
    // add: (entity, table) => pool_query(`insert into ${table} set ?`, entity),
    // del: (condition, table) => pool_query(`delete from ${table} where ?`, condition),
    // patch: (entity, condition, table) => pool_query(`update ${table} set ? where ?`, [entity, condition]),
