const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.sendFile('views/root.html', {root: __dirname })
})

app.get('/new', (req, res) => {
  res.sendFile('views/newBlog.html', {root: __dirname })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
