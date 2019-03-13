import React, { Component } from 'react'
import io from 'socket.io-client'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import axios from '../axios'

const style = {
  main: {
    display: 'flex',
    padding: '30px'
  }, 
  chatStyle: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    flexGrow: 1
  },
  messageBoxStyle: {
    overflow: 'auto',
    height: '65vh',
  },
  listStyle: {
    display: 'flex',
    flexDirection: 'column'
  }, 
  send: {
    display: 'flex',
    alignItems: 'center',
  },
  sendButton: {
    marginLeft: '20px'
  }
}

class Chat extends Component {
  constructor(props) {
    super(props)

    this.sendMessage = this.sendMessage.bind(this)
    this.setMessage = this.setMessage.bind(this)
    this.getMessages = this.getMessages.bind(this)

    this.state = {
      chats: [],
      message: '',
      chatId: '',
      username: window.localStorage.getItem('username'),
      messages: [],
    }     
  }

  getMessages() {
    axios.get(`/api/projects/${this.props.currentProject}/chats`).then(res => {
      res.data.forEach((chat)=>{
        let lastMessage = 'No messages yet'
        if (chat.messages[0]){
          lastMessage = chat.messages[chat.messages.length - 1].content
        }
        chat.lastMessage = lastMessage
      })
      
      this.setState({chats: res.data, chatId: res.data[0]._id, messages: res.data[0].messages})
    })
  }

  componentDidMount() {
    this.getMessages()
    this.socket = io(`${window.origin}`)
    this.socket.emit('authenticate', {username: window.localStorage.getItem('username') } )
    this.socket.on('message', (msg)=> {
      const chat = this.state.chats.find((chat)=>{
        return chat._id.valueOf() === msg.chatId.valueOf()
      })
      chat.messages.concat(msg)
      chat.lastMessage = msg.content
      if (msg.chatId === this.state.chatId) {
        this.setState({ messages: this.state.messages.concat(msg), chats: this.state.chats })}
    })
  }

  componentDidUpdate(prevProps){
    if (this.props.currentProject !== prevProps.currentProject) {
      this.getMessages()
    }
  }

  sendMessage() {
    if (!this.state.message) return
    const message = {
      content: this.state.message,
      chatId: this.state.chatId
    }
    this.socket.emit('message', message)
    this.setState({message: ''})
  }

  setMessage(event) {
    const value = event.target.value
    this.setState({message: value})
  }

  render() {
    return ( 
      <div style={style.main}>
        <List style = {style.listStyle}>
          {this.state.chats.map((chat) => (
            <ChatGroup chat={chat}/>
          )
          )}
          <Button style={style.newChat}>
            <i class="material-icons">group_add</i>
            Create new Chat
          </Button>
        </List>
        <div style={style.chatStyle}>
          <div style={style.messageBoxStyle}>
            {this.state.messages.map((message) => (
              <Message key={message._id} author={message.author} content={message.content}/>
            ))}
          </div> 
          <div style= {style.send}>
            <TextField
              style={ {flexGrow: 1} }
              refs="messageBox"
              margin="normal"
              variant="outlined"
              onChange = {this.setMessage} 
            />
            <Button 
              style={style.sendButton}
              variant="contained" 
              color="primary" 
              onClick={this.sendMessage}>
               Send Message <i class="material-icons">send</i> 
            </Button>
            <Button 
              style={style.sendButton}
              variant="contained" 
              color="primary">
              <i class="material-icons">call</i> 
            </Button>
            <Button 
              style={style.sendButton}
              variant="contained" 
              color="primary">
              <i class="material-icons">duo</i> 
            </Button>
          </div>
        </div>
      </div> )
  }
}

const messageStyle = {
  padding: '3px 0px'
} 

function Message (props) {
  return <div style={messageStyle}>
    <b>{props.author}</b> : {props.content}
  </div>
}

function ChatGroup (props) {
  const chat = props.chat
  return <ListItem button 
    key={chat._id}
    onClick={ ()=> this.setState({chatId: chat._id})} >
    <ListItemText primary={chat.name} secondary={chat.lastMessage}/>
  </ListItem>
}

export default Chat