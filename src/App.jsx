import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import SignIn from './Components/SignIn'
import NavBar from './NavBar'

const styles = {}

class App extends React.Component {
  state = {
    value: 0
  }

  handleChange = (event, value) => {
    this.setState({ value })
  }

  render() {
    return (
      <div>
        <Switch>
          <Route path="/" exact component={SignIn} />
          <Route path="/signin" component = {SignIn} />
          <Route path="/" component={NavBar} />
        </Switch>
      </div>
    )
  }
}

export default withStyles(styles)(App)
