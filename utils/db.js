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
    updateValue: (table, set, where) => {
        query = `UPDATE ${table} SET `;
        let values = [];
        for (let attribute in set){
            query += att + " = ?, ";
            values.push(set[attribute]);
        }
        if (where){
            query += "WHERE "
            for (let attribute in where){
                query += att + " = ? and";
                values.push(set[attribute]);
            }
        }
        pool_query(query, values);
    }

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
    // del: (whereition, table) => pool_query(`delete from ${table} where ?`, whereition),
    // patch: (entity, whereition, table) => pool_query(`update ${table} set ? where ?`, [entity, whereition]),
