const { Client } = require("pg");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const port = 3000;

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "blog",
  password: "blah",
  port: 5432,
});

app.get("/", (req, res) => {
  const selectallQuery = `select * from blog`;
  client.query(selectallQuery, (err, result) => {
    if (err) {
      res.send("error");
    } else {
      console.log(result);
      res.render("root", {
       allblogs : result.rows
      });
    }
  });
  //res.sendFile("views/root.html", { root: __dirname });
});
// app.get("/", (req, res) => {
//   const selectallQuery = `select * from blog`;
//   client.query(selectallQuery, (err, result)=>{
//     if(err) {
//       res.send("error");
//     }
//     else{
//       res.send("Sucessfully Fetched All blogs");
//     }
//   })
// });
app.get("/new", (req, res) => {
  res.sendFile("views/newBlog.html", { root: __dirname });
});

app.get("/blog/:title", (req, res) => {
  const blogTitle = req.params.title;
  const selectQuery = `select * from blog where title='${blogTitle}'`;
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
  const insertQuery = `insert into blog(title, content) VALUES ('${title}', '${content}')`;
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
