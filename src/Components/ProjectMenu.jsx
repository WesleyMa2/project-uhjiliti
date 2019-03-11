import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import axios from 'axios'

const style = {
  padding: '3px',
  color: 'white'
}

// Component to list out the projects of the current user
class ProjectMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      anchorEl: null,
      selectedIndex: 0,
      projects: ['No projects']
    }
  }

  componentDidMount() {
    axios.get('api/user/projects')
      .then( res => {
        this.setState({projects: res.data.projects})
      })
      .catch(err => {
        console.error(err)
      })
  }

  handleClickListItem = (event) => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleMenuItemClick = (event, index) => {
    this.setState({ selectedIndex: index, anchorEl: null })
    console.log(this.state.projects[this.state.selectedIndex], 'has been selected.')
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  render() {
    const { anchorEl } = this.state

    return (
      <div>
        {/* TODO: Make this white  */}
          <ListItem style={style} button aria-haspopup="true" aria-controls="lock-menu" aria-label="Current Project" onClick={this.handleClickListItem}>
            <ListItemText style={{textColor: 'white'}} primary="Current Project" secondary={this.state.projects[this.state.selectedIndex]} />
          </ListItem>
        <Menu id="lock-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleClose}>
          {this.state.projects.map((option, index) => (
            <MenuItem key={option} selected={index === this.state.selectedIndex} onClick={event => this.handleMenuItemClick(event, index)}>
              {option}
            </MenuItem>
          ))}
        </Menu>
      </div>
    )
  }
}

export default ProjectMenu
