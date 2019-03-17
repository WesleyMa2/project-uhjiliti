import React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import NewChatMenu from './NewChatMenu'

const style ={
  listStyle: {
    display: 'flex',
    flexDirection: 'column',
  }, 
  listElement: {
    borderBottom: '1px solid #c4c4c4',
    width: '220px'
  }
}


function ChatList (props) {
  return <List style = {style.listStyle}>
    {props.chats.map((chat) => (
      <ChatGroup     
        key={chat._id}
        chat={chat} 
        handleSelect={props.handleSelect}/>
    )
    )}
    <NewChatMenu currentProject={props.currentProject}/>
  </List>
}


function ChatGroup (props) {
  const chat = props.chat
  return <ListItem 
    button 
    style = {style.listElement}
    onClick={ ()=>{
      props.handleSelect(chat)
    }} >
    <ListItemText primary={chat.name} secondary={chat.lastMessage}/>
  </ListItem>
}

export default ChatList