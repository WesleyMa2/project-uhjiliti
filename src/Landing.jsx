import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import SignIn from './Components/SignIn'
import SignUp from './Components/SignUp'
import NewProject from './Components/NewProject'
import './main.css'
import App from './App'

const styles = {}

class Landing extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/" exact component={SignIn} />
          <Route path="/signin" component = {SignIn} />
          <Route path="/register" component = {SignUp} />
          <Route path="/newProject" component = {NewProject} />
          <Route path="/" component={App} />
        </Switch>
      </div>
    )
  }
}

export default withStyles(styles)(Landing)
