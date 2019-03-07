const mongoose = require('mongoose')
const Schema = mongoose.Schema

const usersSchema = new Schema({
  _id: {type: String, required: true},
  name: {type: String, required: true},
  hash: {type: String, required: true},
  salt: {type: String, required: true},
  projects: [{type: String, ref: 'Project'}]
})

exports.User = mongoose.model('User', usersSchema)

const projectsSchema = new Schema({
  _id: String,
  owner: { type: String, ref: 'User' },
  members: [{ type: String, ref: 'User' }],
  description: String,
  tickets: [{ type: Schema.Types.ObjectId, ref: 'Ticket'}]
})

exports.Project = mongoose.model('Project', projectsSchema)

const ticketSchema = new Schema({
  title: String,
  project: {type: String, ref: 'Project'},
  description: String,
  assignee: { type: String, ref: 'User' },
  watchers: [{ type: String, ref: 'User' }]
})

exports.Ticket = mongoose.model('Ticket', ticketSchema)