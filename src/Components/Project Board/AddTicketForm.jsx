import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Grid from '@material-ui/core/Grid'
import axios from '../../axios'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Chip from '@material-ui/core/Chip'
import moment from 'moment'

const addColBtnStyle = {
  margin: 0,
  top: 'auto',
  right: 20,
  bottom: 20,
  left: 'auto',
  position: 'fixed'
}

// Component that handles the UI for adding updating and viewing columns
export default class AddTicketForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      date: '',
      description: '',
      assignee: '',
      watchers: [],
      open: true,
      members: []
    }
  }
  componentDidMount() {
    this.setState({ date: moment().format('YYYY-MM-DD') })

    axios.get(`/api/projects/${window.localStorage.getItem('currProject')}`).then(res => {
      let members = res.data.members.sort()
      let myIndex = members.indexOf(window.localStorage.getItem('username'))
      this.setState({ assignee: members[myIndex], members: members })
    })
  }

  handleChange = event => {
    event.preventDefault()
    let name = event.target.name
    let value = event.target.value
    this.setState({ [name]: value })
  }

  handleSubmit = () => {
    this.setState({ open: false })
    console.log(this.state)

    this.props.onAdd(this.state)
  }

  render() {
    const membersToList = this.state.members.map(name => (
      <MenuItem key={name} value={name}>
        {name}
      </MenuItem>
    ))
    const { onCancel } = this.props
    const datePicker = (
      <TextField
        required
        name="date"
        label="Due on"
        type="date"
        fullWidth
        defaultValue={this.state.date}
        onChange={this.handleChange}
        InputLabelProps={{
          shrink: true
        }}
      />
    )
    const titleField = <TextField required autoFocus margin="dense" name="title" label="Title" type="text" fullWidth onChange={this.handleChange} />
    const assigneeSelector = (
      <FormControl required fullWidth>
        <InputLabel htmlFor="select-assignee">Assign To</InputLabel>
        <Select value={this.state.assignee} autoWidth name="assignee" onChange={this.handleChange} input={<Input id="select-assignee" />}>
          {membersToList}
        </Select>
      </FormControl>
    )
    const descField = (
      <TextField required autoFocus margin="dense" name="description" label="Description" multiline rows="3" rowsMax="10" type="text" fullWidth error={this.state.error} onChange={this.handleChange} />
    )

    const watchersSelector = (
      <FormControl fullWidth>
        <InputLabel htmlFor="select-watchers">Watchers</InputLabel>
        <Select
          multiple
          value={this.state.watchers}
          autoWidth
          name="watchers"
          onChange={this.handleChange}
          input={<Input id="select-watchers" />}
          renderValue={selected => (
            <div>
              {selected.map(value => (
                <Chip key={value} label={value} style={{ marginLeft: '5px', marginRight: '5px' }} />
              ))}
            </div>
          )}
        >
          {membersToList}
        </Select>
      </FormControl>
    )

    return (
      <Dialog open={this.state.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title" fullWidth maxWidth="md">
        <DialogTitle id="form-dialog-title">New Ticket</DialogTitle>
        <form autoComplete="off" onSubmit={this.handleSubmit.bind(this)}>
          <DialogContent>
            <Grid container spacing={24} justify="space-between" alignItems="flex-end">
              <Grid item xs={4}>
                {titleField}
              </Grid>
              <Grid item xs={4}>
                {assigneeSelector}
              </Grid>
              <Grid item xs={4}>
                {datePicker}
              </Grid>
              <Grid item xs={12}>
                {descField}
              </Grid>
              <Grid item xs={12}>
                {watchersSelector}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={onCancel} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    )
  }
}
