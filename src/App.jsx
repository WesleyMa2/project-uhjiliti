import React from 'react'
import { Route, Link, Switch } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import AppBar from '@material-ui/core/AppBar'
import Board from './Components/ProjectBoard'


function Chat() {
  return <h2>Chat</h2>
}


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
    if (currPath === '/chat') this.setState({ value : 1 })
  }

  render() {
    const { classes } = this.props
    const { value } = this.state
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs centered value={value} onChange={this.handleChange}>
            <Tab label="Board" component={Link} to="/board" />
            <Tab label="Chat" component={Link} to="/chat" />
          </Tabs>
        </AppBar>
        <Switch>
          <Route path="/board" component={Board} />
          <Route path="/chat" exact component={Chat} />
        </Switch>
      </div>
    )
  }
}

export default withStyles(styles)(App)
