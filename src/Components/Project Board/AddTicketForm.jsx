import React from "react"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import Grid from "@material-ui/core/Grid"
import axios from "../../axios"
import Input from "@material-ui/core/Input"
import InputLabel from "@material-ui/core/InputLabel"
import MenuItem from "@material-ui/core/MenuItem"
import FormControl from "@material-ui/core/FormControl"
import Select from "@material-ui/core/Select"
import Chip from "@material-ui/core/Chip"
import moment from "moment"

const addColBtnStyle = {
  margin: 0,
  top: "auto",
  right: 20,
  bottom: 20,
  left: "auto",
  position: "fixed"
}

// Component that handles the UI for adding updating and viewing columns
export default class AddTicketForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: "",
      title: "",
      date: "",
      description: "",
      assignee: "",
      watchers: [],
      open: false,
      members: []
    }
  }
  componentDidMount() {
    this.setState({ date: moment().format("YYYY-MM-DD") })
    if (!this.props.update) this.setState({ open: true })

    // On load need to get the members of the project
    axios.get(`/api/projects/${window.localStorage.getItem("currProject")}`).then(res => {
      let members = res.data.members.sort()
      this.setState({ members: members })
    })
  }

  // Opens the component and preloads the given ticketInfo
  showUpdateView = (ticketData, columnId, projectId) => {
    this.setState({ open: true })
    this.setState(ticketData)
    this.componentDidMount()
  }

  // Takes a field value and sets the corresponding state value
  handleChange = event => {
    event.preventDefault()
    let name = event.target.name
    let value = event.target.value
    this.setState({ [name]: value })
  }

  //
  handleSubmit = event => {
    event.preventDefault()
    let data = {
      title: this.state.title,
      dueDate: this.state.date,
      description: this.state.description,
      assignee: this.state.assignee,
      watchers: this.state.watchers
    }

    if (this.props.update) this.props.onUpdate(this.state.id, data)
    else this.props.onAdd(data)
    this.setState({ open: false })
  }

  render() {
    // Rendered list of all members to be put in a menu list component
    const membersToList = this.state.members.map(name => (
      <MenuItem key={name} value={name}>
        {name}
      </MenuItem>
    ))

    const { onCancel } = this.props
    const handleCancel = e => {
      if (!this.props.update) onCancel()
      this.setState({ open: false })
    }

    // Input field for dates
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

    // Input field for title
    const titleField = <TextField required autoFocus margin="dense" name="title" label="Title" value={this.state.title} type="text" fullWidth onChange={this.handleChange} />

    // Input selector for a single assignee
    const assigneeSelector = (
      // TODO: Make this required
      <FormControl fullWidth>
        <InputLabel htmlFor="select-assignee">Assign To</InputLabel>
        <Select required value={this.state.assignee} autoWidth name="assignee" onChange={this.handleChange} input={<Input id="select-assignee" />}>
          {membersToList}
        </Select>
      </FormControl>
    )

    // Large textfield for description
    const descField = (
      <TextField
        autoFocus
        margin="dense"
        name="description"
        label="Description"
        value={this.state.description}
        multiline
        rows="3"
        rowsMax="10"
        type="text"
        fullWidth
        error={this.state.error}
        onChange={this.handleChange}
      />
    )

    // Input selector for muliple watchers
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
                <Chip key={value} label={value} style={{ marginLeft: "5px", marginRight: "5px" }} />
              ))}
            </div>
          )}
        >
          {membersToList}
        </Select>
      </FormControl>
    )

    // Conditional text depending on whether this component is creating or updating
    let submitButtonText = this.props.update ? "Update" : "Add"
    let formTitle = this.props.update ? "Update Ticket" : "New Ticket"

    return (
      <Dialog open={this.state.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title" fullWidth maxWidth="md">
        <DialogTitle id="form-dialog-title">{formTitle}</DialogTitle>
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
            <Button onClick={handleCancel} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              {submitButtonText}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    )
  }
}
