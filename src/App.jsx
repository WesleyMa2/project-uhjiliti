import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import SignIn from './Components/SignIn'
import NavBar from './NavBar'
import './main.css'

const styles = {}

class App extends React.Component {
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
