import * as dotenv from "dotenv";
import mysql from "mysql2";
dotenv.config();

export const pool = mysql.createPool({
  // host: process.env.DB_HOST,
  // user: process.env.DB_USER,
  // database: process.env.DB_NAME,
  // password: process.env.DB_PASSWORD,
  uri: process.env.DATABASE_URL,
});
// const sql = "SELECT * FROM cards";
// pool.execute(sql, (err, result) => {
//   if (err) throw err;
//   console.log(result);
// });
export const client = pool;
export default pool.promise();
