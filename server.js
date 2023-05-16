const express = require("express");
const mysql = require("mysql2");
const sequelize = require("./connections");
require("dotenv").config();
console.log(process.env);

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to MySQL database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log("Now listening"));
});
