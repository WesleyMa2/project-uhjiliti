import React, { Component } from 'react'
import AsyncBoard from 'react-trello'
import axios from '../axios'
import AddColForm from './AddColForm'

var Column = (function() {
  return function item(name) {
    this.id = name.replace(' ', '-')
    this.title = name
    this.label = ''
    this.style = {width: 280}
    this.cards = []
  }
})()

// Component to display the current user's selected project board
class ProjectBoard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      projectName: this.props.projectId,
      boardData:{
        lanes: []
      }
    }
    this.addColumn = this.addColumn.bind(this)
    this.getColumns = this.getColumns.bind(this)

  }
  componentDidMount(){
    if (this.props.projectId) this.getColumns()
  }
  componentDidUpdate(prevProps) {
    if (this.props.projectId !== prevProps.projectId) this.getColumns()
  }

  addColumn(colName) {
    console.log(colName)
    axios.post('api/projects/' + this.props.projectId + '/columns/', {columnName: colName})
      .then(res => {
        let newLanes = this.state.boardData.lanes.slice()
        newLanes.push(new Column(colName))
        this.setState({boardData: {lanes: newLanes}})
        const board = document.getElementsByClassName('board')[0]
        board.scrollLeft = 30000
      }).catch(err => console.error(err))
  }
  getColumns(){
    axios.get('api/projects/' + this.props.projectId + '/')
      .then(res => {
        let lanes = res.data.columns.map(el => {
          return new Column(el)
        }) 
        this.setState({boardData: {lanes:lanes }})
      })
      .catch(err => console.error(err))
  }
  

  render() {
    return (
      <div>
        <AsyncBoard className="board" data={this.state.boardData} editable draggable/>
        <AddColForm onAdd={this.addColumn}/>
      </div>
    )
  }
}
export default ProjectBoard
