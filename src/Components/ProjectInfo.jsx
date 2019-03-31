import Avatar from '@material-ui/core/Avatar'
import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import Info from '@material-ui/icons/Info'
import axios from '../axios'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import deepOrange from '@material-ui/core/colors/deepOrange'
import deepPurple from '@material-ui/core/colors/deepPurple'
import red from '@material-ui/core/colors/red'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import AddUserForm from './AddUserForm'
import PersonAdd from '@material-ui/icons/PersonAdd'



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
  },
  cssRoot: {
    color: "white",
    backgroundColor: red[600],
    '&:hover': {
      backgroundColor: red[800],
    },
  }
}


// Component that provides info on current project
export default class ProjectInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      projectName: null,
      members: [],
      description: null,
      open: false,
      openUser: false
    }
  }

  componentDidMount() {
    // get the project's info (name, description, members)
    // add it to the state
    if (this.props.currentProject != null) {
      this.getProjectInfo()
    }

  }

  componentDidUpdate(prevProps) {
    if (this.props.currentProject !== prevProps.currentProject) {
      this.getProjectInfo()
    }
  }

  getProjectInfo() {
    axios.get(`/api/projects/${this.props.currentProject}`).then(res => {
      let members = res.data.members
      this.setState({members: members})
      let description = res.data.description
      this.setState({description: description})
      this.setState({projectName: this.props.currentProject})
    })
  }

  handleClickOpen = event => {
    event.preventDefault()
    this.setState({ open: true })
  }

  handleClickOpenAddUser = event => {
    event.preventDefault()
    this.setState({ open: true })
    this.setState({ openUser: true})
  }

  handleClose = event => {
    event.preventDefault()
    this.setState({ open: false })
  }

  addMember = username => {
    axios
      .post('api/projects/' + this.props.currentProject + '/user/', { username: username })
      .then(res => {
        this.getProjectInfo()
      })
      .catch(err => alert(err))
  }

  render() {
    return (
      <div>
        <IconButton color="inherit" onClick={this.handleClickOpen} >
          <Info />
        </IconButton>
        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title" fullWidth="true">
          <DialogTitle id="form-dialog-title">Project Information</DialogTitle>
          <form >
            <DialogContent>
              <TextField 
              disabled
              InputProps={{
                readOnly: true,
              }}
              margin="dense"
              id="name" 
              label="Project Name" 
              type="text" 
              value={this.state.projectName} 
              fullWidth 
              editable="false"
              onChange={this.handleOnChange} />
              <TextField 
              disabled
              InputProps={{
                readOnly: true,
              }}
              margin="dense"
              id="name" 
              label="Description" 
              type="text" 
              value={this.state.description} 
              fullWidth 
              editable="false"
              onChange={this.handleOnChange} />
              <DialogContentText>Members</DialogContentText>
              <List dense>
                {this.state.members.map(member=> (
                  <MemberItem key={member} 
                    member={member}
                  />
                  ))
                }
              </List>
            </DialogContent>
            <DialogActions>
              <AddUserForm onAdd={this.addMember} open={this.state.openUser} />
              <Button 
              onClick={this.handleClose} 
              style={styles.cssRoot}>
                Leave Project
              </Button>
            </DialogActions>
          </form>
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
  </ListItem>
}