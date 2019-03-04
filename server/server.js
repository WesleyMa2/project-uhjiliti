const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000
const cookie = require('cookie')

app.use(bodyParser.json())
app.use(express.static('build'))

const session = require('express-session');
app.use(session({
    secret: 'jew',
    resave: false,
    saveUninitialized: true,
    cookie: {httpOnly: true, secure: true, SameSite: true},
}));

app.use(function(req, res, next){
    var username = (req.session.username)? req.session.username : '';
    res.setHeader('Set-Cookie', cookie.serialize('username', username, {
          path : '/', 
          maxAge: 60 * 60 * 24 * 7, // 1 week in number of seconds
          secure: true,
          SameSite: true
    }));
    next();
});

app.use(function (req, res, next){
    console.log("HTTP request", req.session.post, req.method, req.url, req.body);
    next();
});

const userRoutes = require('./routes/users')
bindRoutes(userRoutes)

function bindRoutes(routes) {
  routes.forEach(route => {
    if (route.method === 'post'){
      app.post(route.path, route.handler)
    } else if (route.method === 'get'){
      app.get(route.path, route.handler)
    }
  })
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`))