const usersFunctions = require('./users')
const schemas = require('./schemas')
const { check, validationResult, param } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

// Project schema from schemas.js
const Project = schemas.Project

// Ticket schema from schemas.js
const Ticket = schemas.Ticket

// User schema from schemas.js
const User = schemas.User

// Helper function that responds with the list of errors
// whenever the parameters aren't valid
const breakIfInvalid = function(req, res, next) {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  next()
}
// CREATE

// curl -d '{"name":"cool ass project", "description":"my first project"}' -H "Content-Type: application/json" -b cookie.txt -X POST http://localhost:4000/api/projects/
exports.createProject = [
  usersFunctions.isAuthenticated,
  check('name', 'Project name must be alphanumeric').exists({checkNull: true, checkFalsy: true}).matches(/^[a-z0-9 ]+$/i),
  breakIfInvalid,
  sanitizeBody('description').trim().escape(),
  sanitizeBody('name').trim().escape(),
  function(req, res) {

    let name = req.body.name
    let description = req.body.description

    // check if theres a project with the same name
    Project.findOne({_id: req.body.name}, function(err, project) {
      if (err) return res.status(500).end(err)
      if (project) return res.status(409).end('There\'s already a project named ' + name)

      let newProject = new Project({
        _id: name,
        description: description,
        columns: ['Todo', 'In Progress', 'Done'],
        members: [req.session.username],
        tickets: []
      })

      // write the project to the db
      newProject.save(function(err, project) {
        if (err) return res.status(500).end(err)

        // add the project to the user's project list
        User.findByIdAndUpdate(req.session.username, { $addToSet: { projects: project._id }}, function(err) {
          if (err) return res.status(500).end(err)
          res.json(project)
        })
      })
    })
  }
]

exports.addUserToProject = [
  usersFunctions.isAuthenticated,
  check('username', 'Username must be alphanumeric').exists({checkNull: true, checkFalsy: true}).isAlphanumeric(),
  breakIfInvalid,
  sanitizeBody('username').trim().escape(),
  function(req, res){
    let projectId = req.params.projectId
    Project.findById(projectId, (err, project)=>{
      if (err) return res.status(500).end(err)
      if (!project) return res.status(404).end('Project id' + projectId + ' does not exist')

      // check if user is a member of the project
      if(!isProjectAuthenticated(req.session.username, project)) return res.status(401).end('Access denied')
      
      // check if user being added exists
      const username = req.body.username
      User.findOne({_id: username}, (err, user)=>{
        if (err) return res.status(500).end(err)
        if (!user) return res.status(404).end('User being added does not exist')
        
        // check if user being added is already a member
        if (project.members.includes(username)) return res.status(409).end('User is already added to project')

        project.members.push(username)
        project.save((err, project)=>{
          if (err) return res.status(500).end(err)
          user.projects.push(projectId)
          user.save((err)=>{
            if (err) return res.status(500).end(err)
            res.json(project)
          })
        })
      })
    })
  }
] 

// TODO: determine who can make this action and implement (rn any authenticated user can make)
// curl -d '{"title":"ticket1", "description":"my first ticket"}' -H "Content-Type: application/json" -b cookie.txt -X POST http://localhost:4000/api/projects/cool%20ass%20project2/columns/:columnId/tickets
exports.createTicket = [
  usersFunctions.isAuthenticated,
  check('title', 'ticketName must not be empty').exists(),
  check('description', 'description must not be empty').exists(),
  check('assignee', 'assignee must not be empty').exists().isString(),
  check('watchers', 'watchers must not be empty, and must be an array').exists().isArray(),
  breakIfInvalid,
  sanitizeBody('title').trim().escape(),
  sanitizeBody('description').trim().escape(),
  function(req, res) {
    let title = req.body.title
    let description = req.body.description
    let projectId = req.params.projectId
    let column = req.params.columnId
    let assignee = req.body.assignee
    let watchers = req.body.watchers ? req.body.watchers : []


    // check if a project with _id projectID exists
    Project.findById(projectId, function(err, project) {
      if (err) return res.status(500).end(err)
      if (!project) return res.status(404).end('Project id' + projectId + ' does not exist')

      // check if user is a member of the project
      if (!isProjectAuthenticated(req.session.username, project)) return res.status(401).end('Access denied')
      
      // Check assignees and watchers are members of the project
      if (!isProjectAuthenticated(assignee, project)) return res.status(409).end('Assignee ' + assignee + ' not part of project')
      watchers = watchers.filter(el => el !== assignee)
      for (let i = 0; i < watchers.length; i++) {
        if (!isProjectAuthenticated(watchers[i], project)) return res.status(409).end('Watcher ' + watchers[i] + ' not part of project')
      } 

      // check if column exists
      if (!project.columns.includes(column)) return res.status(404).end('Column' + column + ' does not exist')

      // make a new ticket
      let newTicket = new Ticket({
        title: title,
        description: description,
        column: column,
        project: projectId,
        assignee: assignee,
        watchers: watchers
      })

      // save the ticket 
      newTicket.save(function(err, ticket) {
        if (err) return res.status(500).end(err)

        // add it to the projects ticket list
        project.tickets.push(ticket._id)
        project.save(function(err) {
          if (err) return res.status(500).end(err)

          // return the newly created ticket
          console.log('Created ticket')
          res.json(ticket)
        })
      })
    })
  }
]

// /api/projects/:projectId/columns
exports.createColumn = [
  usersFunctions.isAuthenticated,
  check('columnName', 'columnName must not be empty').exists(),
  param('projectId', 'projectId must not be empty').exists(),
  breakIfInvalid,
  function(req, res) {
    let projectId = req.params.projectId
    let columnName = req.body.columnName
    Project.findOneAndUpdate({_id: projectId},{$addToSet: {columns: columnName}}, {new: true}, function(err, project){
      if (err) return res.status(500).end(err)
      if (!project) return res.status(404).end('Project id' + projectId + ' does not exist')
      return res.json(project)
    })
  }
]

// READ

// TODO: Get the metadata of the given projecct
// /api/projects/:projectId/
exports.getProject = [
  usersFunctions.isAuthenticated,
  param('projectId', 'projectId must not be empty').exists(),
  breakIfInvalid,
  function (req, res) {
    Project.findById(req.params.projectId, function(err, project){
      let projectId = req.params.projectId
      if (err) return res.status(500).end(err)
      if (!project) return res.status(404).end('Project id' + projectId + ' does not exist')
      return res.json(project)
    })
  }
]

// TODO: Get the tickets of the giben projectId's columnId



function isProjectAuthenticated(username, project){
  return project.members.includes(username)
}