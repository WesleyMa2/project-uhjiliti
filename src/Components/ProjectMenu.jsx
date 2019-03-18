import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import axios from '../axios'

const style = {
  padding: '3px',
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
    this.handleClickListItem = this.handleClickListItem.bind(this)
    this.handleMenuItemClick = this.handleMenuItemClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  componentDidMount() {
    axios.get('api/user/projects')
      .then( res => {
        if (res.data.projects.length > 0) {
          this.setState({projects: res.data.projects})
          this.props.onSelect(this.state.projects[0])
        }
      })
      .catch(err => {
        // TODO: User <SnackBar/> to show error
        console.error(err)
      })
  }

  handleClickListItem (event) {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleMenuItemClick (event, index) {
    this.setState({ selectedIndex: index, anchorEl: null })
    this.props.onSelect(this.state.projects[index])
  }

  handleClose () {
    this.setState({ anchorEl: null })
  }

  render() {
    const { anchorEl } = this.state

    return (
      <div>
        {/* TODO: Make this white  */}
        <ListItem style={style} button aria-haspopup="true" color="text-secondary" aria-controls="lock-menu" aria-label="Current Project" onClick={this.handleClickListItem}>
          <ListItemText primary="Current Project" secondary={this.state.projects[this.state.selectedIndex]} />
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
