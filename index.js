const { Client } = require("pg");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded());
const port = 3000;

const client = new Client({
  user: "postgres",
  host: "127.0.0.1",
  database: "blog",
  password: "",
  port: 54320,
});

app.get("/", (req, res) => {
  res.sendFile("views/root.html", { root: __dirname });
});

app.get("/new", (req, res) => {
  res.sendFile("views/newBlog.html", { root: __dirname });
});

app.post("/blog", (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  const insertQuery = `insert into blogs(title, content) VALUES ('${title}', '${content}')`;
  console.log(insertQuery);
  client.query(insertQuery, (err, result) => {
    if (err) {
      //res.send()
      console.log("failure", err);
    } else {
      res.send("blog created");
    }
  });
});

app.listen(port, () => {
  client.connect();
  console.log(`connected to database: successfully`);
  console.log(`Example app listening at http://localhost:${port}`);
});
