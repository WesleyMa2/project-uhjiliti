import React from 'react'
import { Route, Link, Switch } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import AppBar from '@material-ui/core/AppBar'


function Chat() {
  return <h2>Chat</h2>
}

function Board() {
  return <h2>Board</h2>
}

const styles = {}

class NavBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: 0
    }

    this.handleChange = this.handleChange.bind(this)
  }


  handleChange (event, value) {
    this.setState({ value })
  }

  render() {
    const { classes } = this.props
    const { value } = this.state
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs centered value={value} onChange={this.handleChange}>
            <Tab style={this.style} label="Chat" component={Link} to="/chat" />
            <Tab label="Board" component={Link} to="/board" />
          </Tabs>
        </AppBar>
        <Switch>
          <Route path="/chat" exact component={Chat} />
          <Route path="/board" component={Board} />
        </Switch>
      </div>
    )
  }
}

export default withStyles(styles)(NavBar)
