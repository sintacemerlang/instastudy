const mysql = require('mysql')
const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: '8889',
    user: 'root',
    password: 'root',
    database: 'galeriPhoto'
})

connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }

    console.log("Connected as id " + connection.threadId);
});

module.exports = { connection };