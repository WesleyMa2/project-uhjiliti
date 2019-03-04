import React, { Fragment } from 'react'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
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

class App extends React.Component {
  state = {
    value: 0
  }

  handleChange = (event, value) => {
    this.setState({ value })
  }

  render() {
    const { classes } = this.props
    const { value } = this.state
    return (
      <div>
        <div className={classes.root}>
          <AppBar position="static">
            <Tabs centered value={value} onChange={this.handleChange}>
              <Tab label="Chat" component={Link} to="/chat" />
              <Tab label="Board" component={Link} to="/board" />
            </Tabs>
          </AppBar>
        </div>
        <Switch>
          <Route path="/chat" exact component={Chat} />
          <Route path="/board" component={Board} />
        </Switch>
      </div>
    )
  }
}

export default withStyles(styles)(App)
