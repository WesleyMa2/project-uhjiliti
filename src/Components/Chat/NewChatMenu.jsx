import React from 'react'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Checkbox from '@material-ui/core/Checkbox'
import Avatar from '@material-ui/core/Avatar'
import deepOrange from '@material-ui/core/colors/deepOrange'
import deepPurple from '@material-ui/core/colors/deepPurple'
// import deepRed from "@material-ui/core/colors/deepRed";
// import deepGreen from "@material-ui/core/colors/deepGreen";
// import deepBlue from "@material-ui/core/colors/deepBlue";
import axios from '../../axios'

const styles = {
  root: {
    width: '100%',
    maxWidth: 360,
    // backgroundColor: theme.palette.background.paper,
  },
  avatar: {
    margin: 10
  },
  0: {
    color: '#fff',
    backgroundColor: deepOrange[500]
  },
  1: {
    color: '#fff',
    backgroundColor: deepPurple[500]
  },
  2: {
    color: '#fff',
    backgroundColor: '#009688'
  },
  3: {
    color: '#fff',
    backgroundColor: '#3f51b5'
  },
  4: {
    color: '#fff',
    backgroundColor: '#e91e63'
  },
  5: {
    color: '#fff',
    backgroundColor: '#607d8b'
  }
}

class NewChatMenu extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      members: [],
      chatName: '',
      selectedMembers: [],
      error: false,
      errorMessage: ''
    }

    this.setName = this.setName.bind(this)
    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
    this.handleCreateChat = this.handleCreateChat.bind(this)
  }



  handleClickOpen () {
    this.setState({'open' : true})
  }

  handleClose () {
    this.setState({'open' : false})
    this.setState({selectedMembers: []})
  }

  setName(event) {
    const name = event.target.value
    this.setState({chatName: name})
  }

  handleToggle(value) {
    let newChecked = []
    this.state.selectedMembers.forEach((m) => {
      newChecked.push(m)
    })
    const currentIndex = newChecked.indexOf(value)

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    this.setState({
      selectedMembers: newChecked
    })
  }

  handleCreateChat() {
    let chatName = this.state.chatName
    if (!(/^[\w\-\s]+$/).test(chatName)) {
      return this.setState({error: true, errorMessage: 'Error: Chat name must exist and be alphanumeric.'})
    } else if (this.state.selectedMembers.length === 0) {
      return this.setState({error: true, errorMessage: 'Error: You must select at least one person.'})
    }

    this.createNewChat()
    // TODO: FIGURE OUT HOW TO force update Chat component
    console.log(chatName, this.state.selectedMembers)
  }

  getMembers() {
    axios.get(`/api/projects/${this.props.currentProject}`).then(res => {
      let members = res.data.members
      let myIndex = members.indexOf(window.localStorage.getItem('username'))
      members.splice(myIndex, 1)
      this.setState({members: members})
    })
  }

  createNewChat() {
    let members = this.state.selectedMembers

    // add the current user to the new chat members
    members.push(window.localStorage.getItem('username'))
    axios.post(`/api/projects/${this.props.currentProject}/chats/`, {members: members, name: this.state.chatName}).then(()=>{
      return this.handleClose()
    }).catch((err) => {
      let data = err.response.data
      // if theres a validation error show the messages
      if (err.response.status === 422) {
        let list = ''
        let sep = ''
        data.errors.forEach( (err) => {
          list += (sep + err.msg)
          sep = ', '
        })
        data = list
      }
      this.setState({error: true, errorMessage: `Error: [${err.response.status}] ${data}`})
    })


  }

  componentDidMount() {
    // get list of members in current project
    // add it to the state members list
    if (this.props.currentProject != null) {
      this.getMembers()
    }

  }

  componentDidUpdate(prevProps) {
    if (this.props.currentProject !== prevProps.currentProject) {
      this.getMembers()
    }
  }

  render() {
    
    return (
      <div>
        <Button
          style={{padding: '20px'}}
          onClick={this.handleClickOpen} >
          <i className="material-icons">group_add</i>
        New Chat
        </Button>
        <Dialog
          fullWidth={true}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {'Create a new chat'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Select the recipient(s)
            </DialogContentText>
            <List dense>
              {this.state.members.map(member => (
                <MemberItem key={member} 
                  member={member}
                  handleToggle={this.handleToggle}
                />
              ))
              }
            </List>
            <TextField
              margin="dense"
              id="name"
              label="Chat Name"
              fullWidth
              onChange={this.setName}
            />
            <ErrorText error={this.state.error} errorMessage={this.state.errorMessage}></ErrorText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Nevermind
            </Button>
            <Button onClick={this.handleCreateChat} color="primary">
              Create!
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }

}

function MemberItem (props) {
  const member = props.member
  // assign a random style for the avatar that won't change 
  // on reload
  let style = member.charCodeAt(0) % 6
  return  <ListItem key={props.member} button>
    <ListItemAvatar>
      <Avatar style={styles[style]}>{member[0].toUpperCase()}</Avatar>
    </ListItemAvatar>
    <ListItemText primary={member} />
    <ListItemSecondaryAction>
      <Checkbox 
        onChange={ ()=>{
          props.handleToggle(member)
        }}
      />
    </ListItemSecondaryAction>
  </ListItem>
}

function ErrorText(props) {
  if (props.error) {
    return <div className="center smallError">{props.errorMessage}</div>
  } else return null
}

export default NewChatMenu