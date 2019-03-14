import React, { Component } from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Button from '@material-ui/core/Button'

const style ={
  listStyle: {
    display: 'flex',
    flexDirection: 'column'
  }, 
}

class ChatList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chats: props.chats
    }

    
  }

  componentWillReceiveProps (nextProps) {
    this.setState({chats: nextProps.chats})
  }

  render () {
    console.log(this.state.chats)
    return <List style = {style.listStyle}>
      {this.state.chats.map((chat) => (
        <ChatGroup     
          key={chat._id}
          chat={chat} 
          handleSelect={this.props.handleSelect}/>
      )
      )}
      <Button>
        <i className="material-icons">group_add</i>
        Create new Chat
      </Button>
    </List>
  }
}

function ChatGroup (props) {
  const chat = props.chat
  return <ListItem button 
    onClick={ ()=>{
      props.handleSelect(chat)
    }} >
    <ListItemText primary={chat.name} secondary={chat.lastMessage}/>
  </ListItem>
}

export default ChatList