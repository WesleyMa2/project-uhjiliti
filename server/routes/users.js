const crypto = require('crypto')
const cookie = require('cookie')
const schemas = require('./schemas')
const { check, validationResult } = require('express-validator/check')

// User schema from schemas module
const User = schemas.User

function generateSalt (){
  return crypto.randomBytes(16).toString('base64')
}

function generateHash (password, salt){
  var hash = crypto.createHmac('sha512', salt)
  hash.update(password)
  return hash.digest('base64')
}

const breakIfInvalid = function(req, res, next) {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  next()
}

exports.isAuthenticated = function(req, res, next) {
  if (!req.session.username) return res.status(401).end('access denied')
  next()
}

// TODO: secure with all the things from lab7


// curl -d '{"username":"Test Username", "password":"123", "name":"Test Name"}' -H "Content-Type: application/json" -X POST http://localhost:4000/api/auth/signup/
exports.signup = [
  check('username', 'Username must be alphanumeric').exists({checkNull: true, checkFalsy: true}).isAlphanumeric(),
  check('password', 'password must be at least 5 characters long').exists().isLength({ min: 5 }),
  check('name', 'Name is required and must not contain special characters').exists({checkNull: true, checkFalsy: true}).matches(/^[a-z0-9 ]+$/i),
  breakIfInvalid,
  function(req, res) {

    let username = req.body.username
    let password = req.body.password

    // Validate that username doesn't already exist, if yes return error
    User.findOne( { '_id' : username }, function(err, user) { 
      if (err) return res.status(500).end(err)
      if (user) return res.status(409).end('username ' + username + ' already exists')

      // Hash the password 
      var salt = generateSalt()
      var hash = generateHash(password, salt)
      
      let newUser = new User({
        _id: username,
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
]



// curl -c cookie.txt -d '{"username":"Test Username", "password":"123", "name":"Test Name"}' -H "Content-Type: application/json" -X POST http://localhost:4000/api/auth/signin/
exports.signin = [
  check('username', 'Username must be alphanumeric').exists({checkNull: true, checkFalsy: true}).isAlphanumeric(),
  breakIfInvalid,
  function(req, res) {
    var username = req.body.username
    var password = req.body.password

    User.findOne({_id: username}, function(err, user){
      if (err) return res.status(500).end(err)
      if (!user) return res.status(401).end('access denied')
      if (user.hash !== generateHash(password, user.salt)) return res.status(401).end('access denied') // invalid password
      // start a session
      console.log('user ' + user._id + ' signed in')
      req.session.username = user._id
      res.setHeader('Set-Cookie', cookie.serialize('username', user._id, {
        path : '/', 
        maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
      }))
      res.setHeader('Set-Cookie', cookie.serialize('fullname', user.name, {
        path : '/', 
        maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
      }))
      return res.json('user ' + username + ' has signed in')
    })
  }
]


// curl -b cookie.txt -c cookie.txt localhost:4000/auth/signout/
exports.signout = function (req, res) {
  req.session.destroy()
  res.setHeader('Set-Cookie', cookie.serialize('username', '', {
    path : '/', 
    maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
  }))
  return res.redirect('/')
}


// Get the list of the current user's projects and *project Ids*
// TODO: Make projects have UIDs
// curl -b cookie.txt localhost:4000/api/user/projects
exports.getProjects = [
  exports.isAuthenticated,
  function (req, res) {
    const username = req.session.username
    User.findById(username, {projects: 1, _id: 0}, function(err, projectList){
      if (err) return res.status(500).end(err)
      return res.json(projectList)
    })
  }
]
