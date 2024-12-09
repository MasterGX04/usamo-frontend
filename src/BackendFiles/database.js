import mysql from 'mysql';

const database = mysql.createConnection({
    host: 'localhost',
    user: 'MasterGX',
    password: 'YujinandLiz',
    database: 'math_competition',
    port: 3306
});

database.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    }
    console.eloog('Connected to MySQL database');
})

module.exports = database;