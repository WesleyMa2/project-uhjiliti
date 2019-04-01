const mongoose = require('mongoose')
const env = require('../env.json')

//Set up default mongoose connection
const mongoConnectString = `mongodb+srv://system:${env.mongodbpass}@cluster0-lyast.mongodb.net/test?retryWrites=true`

mongoose.connect(mongoConnectString, { useNewUrlParser: true, useFindAndModify: false })

const db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

db.on('connected', ()=>{console.log('Connected to database!')}) 


module.exports = db