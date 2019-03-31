const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 4000
const cookie = require('cookie')
const session = require('express-session')
const users = require('./routes/users')
const projects = require('./routes/projects')
const tickets = require('./routes/tickets')
const chats = require('./routes/chats')
const http = require('http').Server(app)
const socketio = require('./socket')
require('./database')
const path = require('path')

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../build')))

// populate req with session stuff
app.use(session({
  secret: 'jew',
  resave: false,
  saveUninitialized: true,
  cookie: {httpOnly: true, secure: true, proxy : true, SameSite: true}, //TODO: switch secure to true when we have HTTPS
}))

app.enable('trust proxy'); // optional, not needed for secure cookies
app.use(function(req, res, next){
  var username = (req.session.username)? req.session.username : ''
  res.setHeader('Set-Cookie', cookie.serialize('username', username, {
    proxy: true,
    path : '/', 
    maxAge: 60 * 60 * 24 * 7, // 1 week in number of seconds
    secure: true, //TODO: switch to true when we have HTTPS
    SameSite: true
  }))
  next()
})

// log the HTTP request
app.use(function (req, res, next){
  console.log('HTTP request', req.session.username, req.method, req.url, req.body)
  next()
})

socketio.bindServer(http)

// USERS
app.post('/api/auth/signup', users.signup)
app.post('/api/auth/signin', users.signin)
app.get('/api/auth/signout', users.signout)
app.get('/api/user/projects', users.getProjects)

// PROJECTS
app.post('/api/projects', projects.createProject)
app.post('/api/projects/:projectId/columns/:columnId/tickets', tickets.createTicket)
app.post('/api/projects/:projectId/user', projects.addUserToProject)
app.post('/api/projects/:projectId/columns', tickets.createColumn)
app.get('/api/projects/:projectId', projects.getProject)
app.get('/api/projects/:projectId/columns/:columnId/tickets', tickets.getTickets)
app.patch('/api/projects/:projectId/tickets/:ticketId', tickets.updateTicket)
app.patch('/api/projects/:projectId/columns', projects.orderColumns)

// CHATS
app.post('/api/projects/:projectId/chats', chats.createChat)
app.get('/api/projects/:projectId/chats', chats.getMessages)

app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname, '../build/index.html'))
})

http.listen(port, () => console.log(`Example app listening on port ${port}!`))