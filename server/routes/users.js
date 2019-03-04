const db = require('../database')
const mongoose = require('mongoose')
const Routes = require('./routes')
const Schema = mongoose.Schema
const crypto = require('crypto');
const cookie = require('cookie');


const routes = new Routes()

const usersSchema = new Schema({
  username: String,
  name: String,
  hash: String,
  salt: String,
  projects: [String]
})

const User = mongoose.model('User', usersSchema)

function generateSalt (){
    return crypto.randomBytes(16).toString('base64');
}

function generateHash (password, salt){
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    return hash.digest('base64');
}

// TODO: Validate that all parameters are there (username, name, password), if not return error
// TODO: secure with all the things from lab7


// curl -d '{"username":"Test Username", "password":"123", "name":"Test Name"}' -H "Content-Type: application/json" -X POST http://localhost:3000/api/auth/signup/
function registerUserHandler(req, res) {
  
  let username = req.body.username;
  let password = req.body.password;

  // Validate that username doesn't already exist, if not return error
  User.findOne( { "username" : username }, function(err, user) { 
    if (err) return res.status(500).end(err);
    if (user) return res.status(409).end("username " + username + " already exists");

    // Hash the password 
    var salt = generateSalt();
    var hash = generateHash(password, salt);
    
    let newUser = new User({
      username: username,
      name: req.body.name,
      salt: salt,
      hash: hash,
      projects: []
    })

    // write the user to the db
    newUser.save(function(err, user) {
      if (err) return res.status(500).end(err);
      res.json(user);
    });

  });
};

routes.addRoute('post', '/api/auth/signup/', registerUserHandler);

// curl -c cookie.txt -d '{"username":"Test Username", "password":"123", "name":"Test Name"}' -H "Content-Type: application/json" -X POST http://localhost:3000/api/auth/signin/
function signinUserHandler(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({"username": username}, function(err, user){
    if (err) return res.status(500).end(err);
    if (!user) return res.status(401).end("access denied");
    if (user.hash !== generateHash(password, user.salt)) return res.status(401).end("access denied"); // invalid password
    // start a session
    req.session.username = user.username;
    res.setHeader('Set-Cookie', cookie.serialize('username', user.username, {
          path : '/', 
          maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
    }));
    return res.json("user " + user.username + " signed in");
  });
};

routes.addRoute('post', '/api/auth/signin/', signinUserHandler);

// curl -b cookie.txt -c cookie.txt localhost:3000/signout/
function signoutHandler(req, res, next) {
    req.session.destroy();
    res.setHeader('Set-Cookie', cookie.serialize('username', '', {
          path : '/', 
          maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
    }));
    res.redirect('/');
};

routes.addRoute('get', '/api/auth/signout/', signoutHandler)

module.exports = routes.getRoutes()