import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'

const addColBtnStyle = {
  margin: 0,
  top: 'auto',
  right: 20,
  bottom: 20,
  left: 'auto',
  position: 'fixed'
}

// Component that provides users form for adding new columns
export default class AddUserForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
      open: props.open || false
    }
  }

  // Calls makes given request to add column
  onSubmit = event => {
    event.preventDefault()
    this.props.onAdd(this.state.value)
    this.setState({ open: false })
  }

  handleOnChange = event => {
    event.preventDefault()
    this.setState({ value: event.target.value})
  }

  handleClickOpen = event => {
    event.preventDefault()
    this.setState({ open: true })
  }

  handleClose = event => {
    event.preventDefault()
    this.setState({ open: false })
  }

  render() {
    return (
      <div>
        <Button color="inherit" onClick={this.handleClickOpen} >
          Add Member
        </Button>
        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Add Member</DialogTitle>
          <form onSubmit={this.onSubmit}>
            <DialogContent>
              <DialogContentText>Enter the new member's username</DialogContentText>
              <TextField autoFocus required margin="dense" id="username" label="Username" type="text" fullWidth onChange={this.handleOnChange} />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Add
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    )
  }
}
