import mysql from 'mysql'
import * as dotenv from 'dotenv'
dotenv.config()

const connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.DATABASE_USER,
  password:  process.env.DATABASE_PASSWORD,
  database: 'sendjack'
})

export default connection;
