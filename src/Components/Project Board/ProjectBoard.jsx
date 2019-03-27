import React, { Component } from "react"
import AsyncBoard from "react-trello"
import axios from "../../axios"
import AddColForm from "./AddColForm"
import { CustomLaneHeader, CustomCard } from "./CustomCard"
import Button from "@material-ui/core/Button"
import AddTicketForm from "./AddTicketForm"
import Slide from "@material-ui/core/Slide"

var Column = (function() {
  return function item(name, tickets) {
    this.id = name
    this.title = name
    this.style = { paddingBottom: "10px" }
    this.cards = tickets
  }
})()

var Ticket = (function() {
  return function item(id, name, description, assignee, watchers) {
    this.id = id
    this.title = name
    this.date = "10/10/2019"
    this.description = description
    this.assignee = assignee
    this.watchers = watchers
    this.metadata = this // Stupid recursive definition necessary for onCardClick
  }
})()

// Component to display the current user's selected project board
class ProjectBoard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ticketInfoView: false,
      boardData: {
        lanes: []
      }
    }
  }
  componentDidMount = () => {
    if (this.props.projectId) this.getColumns()
  }
  componentDidUpdate = prevProps => {
    if (this.props.projectId !== prevProps.projectId) this.getColumns()
  }

  // Connects to backend to add a column
  addColumn = colName => {
    axios
      .post("api/projects/" + this.props.projectId + "/columns/", { columnName: colName })
      .then(res => {
        let newLanes = this.state.boardData.lanes.slice()
        newLanes.push(new Column(colName, []))
        this.setState({ boardData: { lanes: newLanes } })
        const board = document.getElementsByClassName("board")[0]
        board.scrollLeft = 30000
      })
      .catch(err => console.error(err))
  }

  // Connects to backend to get column data
  getColumns = () => {
    axios
      .get("api/projects/" + this.props.projectId + "/")
      .then(res => {
        let lanes = []
        let promiseArray = res.data.columns.map(el => {
          return this.getTickets(el)
        })
        // TODO: Move this to server side
        Promise.all(promiseArray).then(tickets => {
          for (let i = 0; i < res.data.columns.length; i++) {
            let trelloTickets = tickets[i].data.map(t => {
              return new Ticket(t._id, t.title, t.description, t.assignee, t.watchers)
            })
            lanes.push(new Column(res.data.columns[i], trelloTickets))
          }
          this.setState({ boardData: { lanes: lanes } })
        })
      })
      .catch(err => console.error(err))
  }

  // Connects to backend to get tickets for a column
  getTickets = columnName => {
    return axios.get("api/projects/" + this.props.projectId + "/columns/" + columnName + "/tickets")
      .catch(err => console.error(err))
  }

  // Connects to backend to add a ticket
  addTicket = (card, laneId) => {
    const data = {
      title: card.title,
      description: card.description,
      assignee: card.assignee,
      watchers: card.watchers
    }
    // Need to make component update
    axios.post("api/projects/" + this.props.projectId + "/columns/" + laneId + "/tickets", data)
      .then(res => this.getColumns())
      .catch(err => console.error(err))
  }

  // Connects to backend to update ticket
  updateTicket = (ticketId, data) => {
    axios.put("api/projects/" + this.props.projectId + "/tickets/" + ticketId, data)
      .then(res => this.getColumns())
      .catch(err => console.error(err))
  }
  render() {
    let updateTicketForm = React.createRef()
    return (
      <div>
        <AddTicketForm update="true" onUpdate={this.updateTicket} ref={updateTicketForm} />
        <Slide direction="right" in mountOnEnter>
          <AsyncBoard
            className="board"
            data={this.state.boardData}
            newCardTemplate={<AddTicketForm />}
            onCardAdd={this.addTicket}
            onCardClick={(ticketId, metadata, columnId) => {
              updateTicketForm.current.showUpdateView(metadata, columnId, this.props.projectId)
            }}
            customLaneHeader={<CustomLaneHeader />}
            addCardLink={
              <Button color="primary" style={{ paddingBottom: 0 }} size="small">
                Add Ticket
              </Button>
            }
            editable
            draggable
            customCardLayout
          >
            <CustomCard />
          </AsyncBoard>
        </Slide>
        <AddColForm onAdd={this.addColumn} />
      </div>
    )
  }
}
export default ProjectBoard
