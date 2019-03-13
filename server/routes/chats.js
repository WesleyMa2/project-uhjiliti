const usersFunctions = require('./users')
const schemas = require('./schemas')
const { check, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')
const Chat = schemas.Chat
const Project = schemas.Project

// Helper function that responds with the list of errors
// whenever the parameters aren't valid
const breakIfInvalid = function(req, res, next) {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  next()
}

// curl -b cookie.txt http://localhost:4000/api/projects/ProjectAwesome/chats/
exports.getMessages = [
  usersFunctions.isAuthenticated,  
  function(req, res) {
    const projectId = req.params.projectId
    const username = req.session.username
    Chat.find({projectId: projectId, members: username}, (err, doc)=>{
      if (err) return res.status(500).end(err)
      res.json(doc)
    })
  }
]

// Create a new Chat room with a list of members
// curl -d '{"name":"Awesome Chat", "members":["alice", "bob"]}' -H "Content-Type: application/json" -b cookie.txt -X POST http://localhost:4000/api/projects/cool%20ass%20project2/chats/
exports.createChat = [
  usersFunctions.isAuthenticated,
  check('name', 'Chat name must be alphanumeric').exists({checkNull: true, checkFalsy: true}),
  check('members', 'Members must be included').exists(),
  breakIfInvalid,
  sanitizeBody('name').trim().escape(),
  function(req, res) {
  
    let name = req.body.name
    let members = req.body.members

    // check if user is a member of the project
    let projectId = req.params.projectId
    Project.findById(projectId, (err, project)=>{
      if (err) return res.status(500).end(err)
      if (!project) return res.status(404).end('Project id' + projectId + ' does not exist')

      // check if user is a member of the project
      if(!isProjectAuthenticated(req.session.username, project)) return res.status(401).end('Access denied')

      // check if users being added are members of the project
      members.forEach(member => {
        if(!isProjectAuthenticated(member, project)) return res.status(403).end(`Member: ${member} is not a member of this project`)
      })

      let newChat = new Chat({
        name: name,
        members: members,
        projectId: projectId,
        messages: []
      })

      newChat.save((err, chat)=>{
        if (err) return res.status(500).end(err)
        res.json(chat)
      })
    })
  }
]

function isProjectAuthenticated(username, project){
  return project.members.includes(username)
}