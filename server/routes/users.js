const db = require('../database')
const mongoose = require('mongoose')
const Routes = require('./routes')
const Schema = mongoose.Schema

const routes = new Routes()

const usersSchema = new Schema({
  username: String,
  name: String,
  password: String,
  projects: [String]
})

const User = mongoose.model('User', usersSchema)


// curl -d '{"username":"Test Username", "password":"123", "name":"Test Name"}' -H "Content-Type: application/json" -X POST http://localhost:3000/api/user
function registerUserHandler(req, res) {
  // TODO: Validate that all parameters are there (username, name, password), if not return error
  // TODO: Validate that username doesn't already exist, if not return error
  // TODO: Hash the password instead of storing it in database as plaintext
  const user = new User({
    username: req.body.username,
    name: req.body.name,
    password: req.body.password,
    projects: []
  })
  db.collection('users').insertOne(user)
  res.json(req.body)
}

routes.addRoute('post', '/api/user', registerUserHandler)

module.exports = routes.getRoutes()