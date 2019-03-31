import React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import CallIcon from '@material-ui/icons/Call'
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
  let activeCall = null;
  let customStyle = Object.assign({}, style.listElement); 

  if (chat.callActive) {
    activeCall = ( <ListItemIcon>
      <CallIcon />
    </ListItemIcon>)
    Object.assign(customStyle, {backgroundColor: '#b3b3ff' })
  }

  return <ListItem 
    button 
    style = {customStyle}
    onClick={ ()=>{
      props.handleSelect(chat)
    }} >
    <ListItemText primary={chat.name} secondary={chat.lastMessage}/>
    {activeCall}
  </ListItem>
}

export default ChatList