require("dotenv").config();

const express = require("express");
const app = express();
const mysql = require("mysql");

app.set("view engine", "pug");
app.get("/", (req, res) => {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  connection.query("SELECT * FROM user", function(error, results, fields) {
    if (error) throw error;
    res.render("index", { users: results });
  });
});

app.listen(3000, () => {
  console.log("App listening on port 3000.");
});
