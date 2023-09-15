const mysql = require('mysql2');

require('dotenv').config();

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "Racecar123",
        database: 'company_db'
});

module.exports = db;