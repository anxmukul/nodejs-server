const { Client } = require("pg");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const port = 3000;

const client = new Client({
  user: "postgres",
  host: process.env.host_name,
  database: "blog",
  password: process.env.password,
  port: process.env.portnumber,
});

app.get("/", (req, res) => {
  const selectallQuery = `select * from blogs`;
  client.query(selectallQuery, (err, result) => {
    if (err) {
      res.send("error");
    } else {
      res.render("root", {allblog : result.rows});
    }
  });
});
app.get("/new", (req, res) => {
  res.sendFile("views/newBlog.html", { root: __dirname });
});

app.get("/blog/:title", (req, res) => {
  const blogTitle = req.params.title;
  const selectQuery = `select * from blogs where title='${blogTitle}'`;
  client.query(selectQuery, (err, result) => {
    if (err) {
      res.send("error");
    } else {
      res.render("blog", {
        title: result.rows[0].title,
        content: result.rows[0].content,
      });
    }
  });
});

app.post("/blog", (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  const insertQuery = `insert into blogs(title, content) VALUES ('${title}', '${content}')`;
  client.query(insertQuery, (err, result) => {
    if (err) {
      console.log("failure", err);
    } else {
      res.redirect(`/blog/${title}`);
    }
  });
});

app.listen(port, () => {
  client.connect();
  console.log(`connected to database: successfully`);
  console.log(`Example app listening at http://localhost:${port}`);
});
