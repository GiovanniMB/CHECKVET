const mysql = require('mysql');

let connection = mysql.createConnection(
    {
        host:'localhost',
        user:'root',
        password:'Millan2801',
        database:'dbvet'
    }
);
connection.connect(function(error)
{
    if(error) throw error;
    console.log('la conexion a sido exitosa');
});
module.exports = connection;