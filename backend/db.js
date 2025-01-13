const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'test',
    password: 'qqer',
    database: 'logistics_db',
});

db.connect(err => {
    if (err) throw err;
    console.log('DB connected')
})

module.exports = db;
