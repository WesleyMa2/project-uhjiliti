const socketio = require('socket.io')
const Chat = require('./routes/schemas').Chat
const Message = require('./routes/schemas').Message

const sessions = {}
const connections = {}

function bindServer(http) {
  const io = socketio(http)

  io.on('connection', function(socket){
    socket.on('authenticate', function(data){
      if (data.username) {
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
      }
    })
  })
}

module.exports = { bindServer }