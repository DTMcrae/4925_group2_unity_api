require("dotenv").config();

//AWS RDS connection
const mysql = require("mysql2/promise");
var dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
  multipleStatements: false,
  namedPlaceholders: true,
};

const database = mysql.createPool(dbConfig);

module.exports = { database };
