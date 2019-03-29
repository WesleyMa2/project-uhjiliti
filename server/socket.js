const socketio = require('socket.io')
const Chat = require('./routes/schemas').Chat
const Message = require('./routes/schemas').Message

const sessions = {}
const connections = {}
const calls = {}
let io = {}

function bindServer(http) {
  io = socketio(http)

  io.on('connection', function(socket){
    socket.on('authenticate', function(data){
      if (data.username) {
        console.log(`User: ${data.username} connected to chat.`)
        sessions[data.username] = socket.id
        connections[socket.id] = data.username
        socket.on('message', function(data){
          console.log(`Message: ${data.content} recived from ${connections[socket.id]}`)
          Chat.findOne({_id: data.chatId}, function(err, chat){
            if (err) return console.log(err) // TODO: Handle this
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
              if (err) return console.log(err) // TODO: Handle this
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
      const username = connections[socket.id]
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
      }
    }
  }
}

module.exports = { bindServer }