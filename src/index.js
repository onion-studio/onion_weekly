require("dotenv").config();

const express = require("express");
const app = express();
const mysql = require("mysql");

app.set("view engine", "pug");
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  connection.query("SELECT * FROM issue", function(error, results, fields) {
    if (error) throw error;
    res.render("index", { issues: results });
    connection.end();
  });
});

app.get("/form", (req, res) => {
  res.render("form");
});

app.post("/form", (req, res) => {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });
  const { author_id, assignee_id, title, content } = req.body;
  connection.query(
    `
    INSERT INTO issue (author_id, assignee_id, title, content, status, created_at) 
    VALUES (${author_id}, ${assignee_id ||
      null}, '${title}', '${content}', 'open', NOW())`,
    function(error, results, fields) {
      if (error) throw error;
      connection.end();
      res.redirect("/");
    }
  );
});

app.post("/resolve/:id", (req, res) => {
  const id = req.params.id;
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  connection.query(
    `UPDATE issue SET status = 'resolved' WHERE id = ${id}`,
    function(error, results, fields) {
      if (error) throw error;
      res.redirect("/");
      connection.end();
    }
  );
});

app.get("/issues/:id", (req, res) => {
  const id = req.params.id;
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  connection.query(`SELECT * FROM issue WHERE id = ${id}`, function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    res.render("issue", { issue: results[0] });
    connection.end();
  });
});

app.listen(3000, () => {
  console.log("App listening on port 3000.");
});
