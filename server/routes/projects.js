const usersFunctions = require('./users')
const schemas = require('./schemas')
const { check, validationResult, param } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

// Project schema from schemas.js
const Project = schemas.Project

// User schema from schemas.js
const User = schemas.User

// Helper function that responds with the list of errors
// whenever the parameters aren't valid
const breakIfInvalid = function(req, res, next) {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    return  res.status(422).json({ errors: errors.array() })
  }
  next()
}
// CREATE

// curl -d '{"name":"cool ass project", "description":"my first project"}' -H "Content-Type: application/json" -b cookie.txt -X POST http://localhost:4000/api/projects/
exports.createProject = [
  usersFunctions.isAuthenticated,
  check('name', 'Project name must be alphanumeric')
    .exists({ checkNull: true, checkFalsy: true })
    .matches(/^[a-z0-9 ]+$/i),
  breakIfInvalid,
  sanitizeBody('description')
    .trim()
    .escape(),
  sanitizeBody('name').trim(),
  function(req, res) {
    let name = req.body.name
    let description = req.body.description

    // check if theres a project with the same name
    Project.findOne({ _id: req.body.name }, function(err, project) {
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
        User.findByIdAndUpdate(req.session.username, { $addToSet: { projects: project._id } }, function(err) {
          if (err) return res.status(500).end(err)
          res.json(project)
        })
      })
    })
  }
]

exports.addUserToProject = [
  usersFunctions.isAuthenticated,
  check('username', 'Username must be alphanumeric')
    .exists({ checkNull: true, checkFalsy: true })
    .isAlphanumeric(),
  breakIfInvalid,
  sanitizeBody('username')
    .trim()
    .escape(),
  function(req, res) {
    let projectId = req.params.projectId
    Project.findById(projectId, (err, project) => {
      if (err) return res.status(500).end(err)
      if (!project) return res.status(404).end('Project id' + projectId + ' does not exist')

      // check if user is a member of the project
      if (!isProjectAuthenticated(req.session.username, project)) return res.status(401).end('Access denied')

      // check if user being added exists
      const username = req.body.username
      User.findOne({ _id: username }, (err, user) => {
        if (err) return res.status(500).end(err)
        if (!user) return res.status(404).end('User being added does not exist')

        // check if user being added is already a member
        if (project.members.includes(username)) return res.status(409).end('User is already added to project')

        project.members.push(username)
        project.save((err, project) => {
          if (err) return res.status(500).end(err)
          user.projects.push(projectId)
          user.save(err => {
            if (err) return res.status(500).end(err)
            res.json(project)
          })
        })
      })
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
  function(req, res) {
    Project.findById(req.params.projectId, function(err, project) {
      let projectId = req.params.projectId
      if (err) return res.status(500).end(err)
      if (!project) return res.status(404).end('Project id' + projectId + ' does not exist')
      if (!isProjectAuthenticated(req.session.username, project)) return res.status(401).end('Access denied')

      return res.json(project)
    })
  }
]

// UPDATE
// /api/projects/:projectId/columns
exports.orderColumns = [
  usersFunctions.isAuthenticated,
  check('columns', 'columns must be an array').exists().isArray(),
  param('projectId', 'projectId must not be empty').exists(),
  breakIfInvalid,
  function(req, res) {
    let columns = req.body.columns
    Project.findById(req.params.projectId, function(err, project) {
      let projectId = req.params.projectId
      if (err) return res.status(500).end(err)
      if (!project) return res.status(404).end('Project id' + projectId + ' does not exist')
      if (!isProjectAuthenticated(req.session.username, project)) return res.status(401).end('Access denied')

      // Check if given array of columns have the same elements
      let currCols = new Set(project.columns)
      let newCols = new Set(columns)
      if (currCols.size != (new Set(newCols, currCols)).size) return res.status(409).end('Conflict with given columns')
      project.columns = columns
      project.save().then(project => {return res.json(project)})
        .catch(err => {return res.status(500).end(err)})
    })
  }
]

function isProjectAuthenticated(username, project) {
  return project.members.includes(username)
}
