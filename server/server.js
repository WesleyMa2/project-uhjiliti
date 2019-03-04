const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(express.static('build'))

const userRoutes = require('./routes/users')
bindRoutes(userRoutes)

function bindRoutes(routes) {
  routes.forEach(route => {
    if (route.method === 'post'){
      app.post(route.path, route.handler)
    }
  })
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`))