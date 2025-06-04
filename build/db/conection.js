import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Devs0709',
  database: 'dbvet',
});

export default connection;