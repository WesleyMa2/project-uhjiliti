import React, { Component } from 'react'
import io from 'socket.io-client'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import axios from '../axios'
import ChatList from './ChatList'
import moment from 'moment'
import ReactMarkdown  from 'react-markdown'
import Slide from '@material-ui/core/Slide'

const style = {
  main: {
    display: 'flex',
    padding: '30px',
    marginTop: '3em'
  }, 
  chatStyle: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    flexGrow: 1,
    borderLeft: '1px solid #c4c4c4'
  },
  messageBoxStyle: {
    overflow: 'auto',
    height: 'calc(100vh - 180px - 3em)',
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
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.getMessages = this.getMessages.bind(this)
    this.selectChat = this.selectChat.bind(this)
    this.scrollToBottom = this.scrollToBottom.bind(this)

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
        chat.lastMessage = trimMessage(lastMessage)
      })
      if (res.data[0]) {
        this.setState({chats: res.data, chatId: res.data[0]._id, messages: res.data[0].messages})
      } else {
        this.setState({chats: [], chatId: undefined, messages: []})
      }
    })
  }

  componentDidMount() {
    this.getMessages()
    this.socket = io(`${window.origin}`)
    this.socket.emit('authenticate', {username: window.localStorage.getItem('username') } )
    this.socket.on('message', (msg)=> {
      const chatIndex = this.state.chats.findIndex((chat)=>{
        return chat._id.valueOf() === msg.chatId.valueOf()
      })
      if (msg.chatId === this.state.chatId) {
        this.setState({ messages: this.state.messages.concat(msg) })
      }
      if (chatIndex && (chatIndex !== -1)) {
        const newChats = this.state.chats
        newChats[chatIndex].messages =  newChats[chatIndex].messages.concat(msg)
        newChats[chatIndex].lastMessage = trimMessage(msg.content)
        this.setState({
          chats: newChats
        })
      }
    })
  }

  componentWillUnmount() {
    this.socket.disconnect()
  }

  componentDidUpdate(prevProps, prevState){
    if (this.props.currentProject !== prevProps.currentProject) {
      this.getMessages()
    } 
    if (this.state.chatId !== prevState.chatId) {
      this.scrollToBottom()
    }
    // Scroll chatbox if its close to bottom 
    const messageBox = this.refs['messageBox']
    const currentHeight = messageBox.scrollHeight - messageBox.clientHeight
    if (messageBox.scrollTop >= currentHeight - 30) {
      messageBox.scrollTop = currentHeight + 30
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

  handleKeyPress(event) {
    if (event.key === 'Enter'){
      this.sendMessage()
    }
  }

  scrollToBottom () {
    const messageBox = this.refs['messageBox']
    messageBox.scrollTop = messageBox.scrollHeight
  }

  selectChat(chat) {
    this.setState({messages: chat.messages, chatId: chat._id})
  }

  render() {
    return ( 
      <Slide direction="left" in mountOnEnter >
        <div style={style.main}>
          <ChatList chats={this.state.chats} currentProject={this.props.currentProject} handleSelect={(chat)=>this.selectChat(chat)}/>
          <div style={style.chatStyle}>
            <div style={style.messageBoxStyle} ref="messageBox">
              {this.state.messages.map((message) => (
                <Message key={message._id} author={message.author} content={message.content} date={message.date} />
              ))}
            </div> 
            <div style= {style.send}>
              <TextField
                style={ {flexGrow: 1} }
                refs="messageBox"
                margin="normal"
                variant="outlined"
                onChange = {this.setMessage} 
                value={this.state.message}
                onKeyPress = {this.handleKeyPress}
              />
              <Button 
                style={style.sendButton}
                variant="contained" 
                color="primary" 
                onClick={this.sendMessage}>
               Send Message&emsp;<i className="material-icons">send</i> 
              </Button>
              <Button 
                style={style.sendButton}
                variant="contained" 
                color="primary">
                <i className="material-icons">call</i> 
              </Button>
              <Button 
                style={style.sendButton}
                variant="contained" 
                color="primary">
                <i className="material-icons">duo</i> 
              </Button>
            </div>
          </div>
        </div>
      </Slide>
    )
  }
}

const messageStyle = {
  padding: '3px 0px',
  display: 'flex',
  alignItems: 'center',
  
} 

function Message (props) {
  const time = moment(props.date)
  return <div style={messageStyle}>
    <div style={{flexGrow: 1}}>
      <b>{props.author}</b> : <ReactMarkdown source={props.content}/>
    </div> 
    <div>
      {time.format('h:mm:ss A')}
    </div>
  </div>
}

function trimMessage(s) {
  if(s.length > 25) {
    s = s.substring(0,24)+'...'
  }
  return s
}


export default Chat