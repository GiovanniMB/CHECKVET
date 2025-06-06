//db.js

import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const conexion = mysql.createConnection({
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});



conexion.connect((err) => {
  if (err) {
    console.log('El error de la conexión es: ' + err);
    return;
  }
  console.log('Base de datos conectada');
});

export default conexion;