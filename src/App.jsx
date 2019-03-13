import React from 'react'
import { Route, Link, Switch } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import AppBar from '@material-ui/core/AppBar'
import Board from './Components/ProjectBoard'
import Chat from './Components/Chat'

const styles = {}

// Compontent holding main app
class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: 0
    }
    this.handleChange = this.handleChange.bind(this)
  }

  // Changes the highlighted tab
  handleChange (event, value) {
    this.setState({ value })
  }

  // Sets the correct highlighted tab on load
  componentDidMount() {
    let currPath = this.props.location.pathname
    if (currPath === '/project/:projectId/chat') this.setState({ value : 1 })
  }

  render() {
    const { classes } = this.props
    const { value } = this.state
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs centered value={value} onChange={this.handleChange}>
            <Tab label="Board" component={Link} to={`/project/${'ProjectId'}/board`} />
            <Tab label="Chat" component={Link} to={`/project/${'ProjectId'}/chat`} />
          </Tabs>
        </AppBar>
        <Switch>
          <Route path="/project/:projectId/board" component={Board} />
          <Route path="/project/:projectId/chat" exact component={Chat} />
        </Switch>
      </div>
    )
  }
}

export default withStyles(styles)(App)
