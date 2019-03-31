const socketio = require('socket.io')
const Chat = require('./routes/schemas').Chat
const Message = require('./routes/schemas').Message
const sharedSession = require("express-socket.io-session")

const sessions = {}
const connections = {}
const calls = {}
let io = {}

function bindServer(http, session) {
  io = socketio(http)

  console.log(session)

  io.use(sharedSession(session))

  io.on('connection', function(socket){
    const username = socket.handshake.session.username
    socket.on('authenticate', function(){
      if (username) {
        console.log(`User: ${username} connected to chat.`)
        sessions[username] = socket.id
        connections[socket.id] = username
        socket.on('getActiveCalls', ()=> {
          Chat.find({members: username}, (_, chats)=>{
            chats.forEach(chat => {
              if (calls[chat._id]) {
                io.to(sessions[username]).emit('callActive', chat._id)
              }
            })
          })
        })
        socket.on('message', function(data){
          console.log(`Message: ${data.content} recived from ${connections[socket.id]}`)
          Chat.findOne({_id: data.chatId}, function(err, chat){
            if (err) return console.log(err)
            const newMessage = new Message({
              date: Date.now(), 
              author: connections[socket.id],
              content: data.content
            })
    
            const packet = {
              date: newMessage.date,
              author: newMessage.author,
              content: newMessage.content,
              chatId: data.chatId,
              _id: newMessage._id
            }
              
            chat.messages.push(newMessage)
            chat.save(err =>{
              if (err) return console.log(err) 
              chat.members.forEach((member)=>{
                io.to(sessions[member]).emit('message', packet)
              })
            })
          })
        })
        socket.on('joinCall', function(data) {
          console.log(`${connections[socket.id]} has joined call ${data.chatId}`)
          if (!calls[data.chatId]) {
            console.log(`Call ${data.chatId} doesn't exist yet. Creating call.`)
            notifyMembersCallStart(data.chatId)
            calls[data.chatId] = {}
          }
          for (const peer in calls[data.chatId]) {
            const peerId = calls[data.chatId][peer].id
            io.to(peerId).emit('createPeer', socket.id)
          }
          calls[data.chatId][socket.id] = socket
        })
        socket.on('signal', function(data) {
          // console.log(`${socket.id}-> ${data.target}`)
          io.to(data.target).emit('signal', {
            data: data.data,
            target: socket.id
          })
        })
        socket.on('leaveCall', function() {
          leaveCall(socket.id)
        })
      }
    })
    socket.on('disconnect', ()=>{
      console.log(`User: ${username} disconnect from chat.`)
      leaveCall(socket.id)
      delete sessions[username]
      delete connections[socket.id]
    })
  })

}

function leaveCall(socketId) {
  const username = connections[socketId]
  for (const key in calls){
    const call = calls[key]

    if (call[socketId]) {
      console.log(`Removing ${username} from call ${key}`)
      delete call[socketId]
      for (const connection in call) {
        io.to(connection).emit('disconnectPeer', socketId)
      }
      if (Object.keys(call).length == 0){
        delete calls[key]
        console.log(`Call: ${key} is empty. Deleting call`)
        notifyMembersCallEnd(key)
      }
    }
  }
}

function notifyMembersCallStart(chatId) {
  Chat.findById(chatId , (err, chat)=> {
    if (err) console.err(err)
    else {
      chat.members.forEach( member => {
        if (sessions[member]) {
          io.to(sessions[member]).emit('callActive', chatId)
        }
      })
    }
  })
}

function notifyMembersCallEnd(chatId) {
  Chat.findById(chatId , (err, chat)=> {
    if (err) console.err(err)
    else {
      chat.members.forEach( member => {
        if (sessions[member]) {
          io.to(sessions[member]).emit('callFinished', chatId)
        }
      })
    }
  }) 
}

module.exports = { bindServer }