import React, { Component } from 'react'
import AsyncBoard from 'react-trello'
import data from '../resources/test_data.json'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import axios from '../axios'


const addColBtnStyle = {
  margin: 0,
  top: 'auto',
  right: 20,
  bottom: 20,
  left: 'auto',
  position: 'fixed',
}

class ProjectBoard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      projectName: this.props.projectId,
      boardData:{
        lanes: []
      }
    }
    this.getColumns = this.getColumns.bind(this)

  }

  componentDidMount(){
    if (this.props.projectId) this.getColumns()
  }

  getColumns(){
    axios.get('api/projects/' + this.props.projectId + '/columns')
      .then(res => {
        let lanes = res.data.map(el => {
          return {
            id: el.replace(' ', '-'),
            title: el,
            label: '',
            style: {width: 280},
            cards: []
          }
        }) 
        this.setState({boardData: {lanes:lanes }})
      })
      .catch(err => console.error(err))
  }
  componentDidUpdate(prevProps) {
    if (this.props.projectId !== prevProps.projectId) this.getColumns()
  }

  render() {
    return (
      <div>
        <AsyncBoard className="board" data={this.state.boardData} editable draggable />
        <Fab style={addColBtnStyle} color="primary">
          <AddIcon/>
        </Fab>
      </div>
    )
  }
}
export default ProjectBoard
