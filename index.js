const { Client } = require("pg");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const port = 3000;

const client = new Client({
  user: "postgres",
  host: process.env.hostName,
  database: process.env.dataBase,
  password: process.env.passWord,
  port: process.env.portNumber,
});

app.get("/", (req, res) => {
  var today = new Date()
  var curHr = today.getHours()

  if (curHr < 12) {
    var greeting = 'Good Morning';
  } else if (curHr < 18) {
    var greeting = 'Good Afternoon';
  } else {
    var greeting = 'Good Evening'
  }
  const selectallQuery = `select * from blogs`;
  client.query(selectallQuery, (err, result) => {
    if (err) {
      res.send("error");
    } else {
      res.render("root", {
        allblog : result.rows,
        greet   : greeting
      });
    }
  });
});
app.get("/new", (req, res) => {
  res.sendFile("views/newBlog.html", { root: __dirname });
});

app.get("/edit/:title", (req, res) => {
  const blogTitle = req.params.title;
  console.log(blogTitle);
  const selectSql = `select * from blogs where title='${blogTitle}'`;
  client.query(selectSql, (err, result) => {
    if (err) {
      res.send("error");
    } else {
      res.render("edit", {
        blogId: result.rows[0].id,
        title: result.rows[0].title,
        content: result.rows[0].content,
      });
    }
  }); 
})
app.get("/blog/:title", (req, res) => {
  const blogTitle = req.params.title;
  const selectQuery = `select * from blogs where title='${blogTitle}'`;
  client.query(selectQuery, (err, result) => {
    if (err) {
      res.send("error");
    } else {
      console.log(result);
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
app.post("/edit", (req, res) => {
  const blogId = req.body.id;
  const title = req.body.title;
  const content = req.body.content;
  const updateQuery = `update blogs set title = '${title}' , content = '${content}' where id = ${blogId}`;
  client.query(updateQuery, (err, result) => {
    if (err) {
      console.log("failure", err);
    } else {
      res.redirect(`/blog/${title}`);
      //res.send("Updated");
    }
  });
})
app.listen(port, () => {
  client.connect();
  console.log(`connected to database: successfully`);
  console.log(`Example app listening at http://localhost:${port}`);
});
