const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

module.exports = function(app) {
    app.set('trust proxy', 1) // trust first proxy
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        // cookie: { secure: true }
        
        store: new MySQLStore({
            connectionLimit: 100,
            host: 'webprojectdb.cemjothahgv9.ap-southeast-1.rds.amazonaws.com',
            port: 3306,
            user: 'ptsang',
            password: '123123123',
            database: 'webproject',
            charset: 'utf8mb4_bin',
            schema: {
                tableName: 'sessions',
                columnNames: {
                    session_id: 'session_id',
                    expires: 'expires',
                    data: 'data'
                }
            }
        }),
    }))
};