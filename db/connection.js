const mysql = require("mysql2");
require("dotenv").config();

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // Your MySQL username,
    user: "root",
    // .env file containing your password
    password: process.env.DB_PW,
    database: "employeetracker",
  },
  console.log("Connected to the employeeTracker database.")
);

module.exports = db;
