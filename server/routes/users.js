const mongoose = require('mongoose')
const Schema = mongoose.Schema
const crypto = require('crypto')
const cookie = require('cookie')

const usersSchema = new Schema({
  username: String,
  name: String,
  hash: String,
  salt: String,
  projects: [String]
})

const User = mongoose.model('User', usersSchema)

function generateSalt (){
  return crypto.randomBytes(16).toString('base64')
}

function generateHash (password, salt){
  var hash = crypto.createHmac('sha512', salt)
  hash.update(password)
  return hash.digest('base64')
}

// TODO: Validate that all parameters are there (username, name, password), if not return error
// TODO: secure with all the things from lab7


// curl -d '{"username":"Test Username", "password":"123", "name":"Test Name"}' -H "Content-Type: application/json" -X POST http://localhost:3000/api/auth/signup/
exports.signup = function(req, res) {
  
  let username = req.body.username
  let password = req.body.password

  if (!username) return res.status(404).end('Username required')
  if (!password) return res.status(404).end('Password required')
  if (username === '') return res.status(404).end('Username cannot be empty')
  if (password === '') return res.status(404).end('Password cannot be empty')

  // Validate that username doesn't already exist, if yes return error
  User.findOne( { 'username' : username }, function(err, user) { 
    if (err) return res.status(500).end(err)
    if (user) return res.status(409).end('username ' + username + ' already exists')

    // Hash the password 
    var salt = generateSalt()
    var hash = generateHash(password, salt)
    
    let newUser = new User({
      username: username,
      name: req.body.name,
      salt: salt,
      hash: hash,
      projects: []
    })

    // write the user to the db
    newUser.save(function(err, user) {
      if (err) return res.status(500).end(err)
      res.json(user)
    })

  })
}



// curl -c cookie.txt -d '{"username":"Test Username", "password":"123", "name":"Test Name"}' -H "Content-Type: application/json" -X POST http://localhost:3000/api/auth/signin/
exports.signin = function(req, res) {
  var username = req.body.username
  var password = req.body.password
  if (!username) return res.status(404).end('Username required')
  if (!password) return res.status(404).end('Password required')

  User.findOne({'username': username}, function(err, user){
    if (err) return res.status(500).end(err)
    if (!user) return res.status(401).end('Access denied')
    if (user.hash !== generateHash(password, user.salt)) return res.status(401).end('Access denied') // invalid password
    // start a session
    console.log('user ' + user.username + ' signed in')
    req.session.username = user.username
    res.setHeader('Set-Cookie', cookie.serialize('username', user.username, {
      path : '/', 
      maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
    }))
    return res.json('user ' + user.username + ' signed in')
  })
}



// curl -b cookie.txt -c cookie.txt localhost:3000/signout/
exports.signout = function (req, res) {
  req.session.destroy()
  res.setHeader('Set-Cookie', cookie.serialize('username', '', {
    path : '/', 
    maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
  }))
  res.redirect('/')
}

