const { Client } = require('pg')
const express = require('express')
const app = express()
const port = 3000

const client = new Client({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'blog',
  password: '',
  port: 54320,
})

app.get('/', (req, res) => {
  res.sendFile('views/root.html', {root: __dirname })
})

app.get('/new', (req, res) => {
  res.sendFile('views/newBlog.html', {root: __dirname })
})

app.listen(port, () => {
  client.connect()
  console.log(`connected to database: successfully`)
  console.log(`Example app listening at http://localhost:${port}`)
})
