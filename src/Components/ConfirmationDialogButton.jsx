import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

// component for confirmation dialogs
export default class ConfirmationDialogButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
    }
    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleAgree = this.handleAgree.bind(this)
  }

  handleClickOpen(event) {
    event.preventDefault()
    this.setState({ open: true })
  }

  handleClose(event) {
    event.preventDefault()
    this.setState({ open: false })
  }

  handleAgree(event) {
    event.preventDefault()
    this.props.onAgree()
  }

  render() {
    return (
      <div>
        <Button onClick={this.handleClickOpen} style={this.props.style}>
          {this.props.buttonText}
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{this.props.title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.props.content}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Disagree
            </Button>
            <Button onClick={this.handleAgree} color="primary" autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}