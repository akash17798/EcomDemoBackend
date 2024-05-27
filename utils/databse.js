const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "ecommerce",
  password: "Akash@17798",
  keepAliveInitialDelay: 10000, // 0 by default.
  enableKeepAlive: true, // false by default.
});

module.exports = pool.promise();
