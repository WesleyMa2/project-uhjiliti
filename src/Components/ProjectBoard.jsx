import React, { Component } from 'react'
import Board from 'react-trello'
import data from '../resources/test_data.json'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'


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
      projectName: null, 
      boardDate: {} // We will use this to store the data that will be pulled from the db
    }
  }

  render() {
    return (
      <div>
        <Board className="board" data={data} editable draggable />
        <Fab style={addColBtnStyle} color="primary">
          <AddIcon/>
        </Fab>
      </div>
    )
  }
}
export default ProjectBoard
