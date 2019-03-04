import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { Jumbotron, Container } from 'reactstrap'
import { Link } from 'react-router-dom'
import './SignIn.css'


class SignIn extends Component {

  // function login(username, password) {
  //   console.log(`Login button clicked! ${username}, ${password}`)
  // }

  render() {
    return (
      <Container fluid className="loginContainer verticalCenter">
        <Jumbotron className="loginForm">
          <h2 className="center">Uhjility</h2>
          <div className="center">
            <TextField
              id="outlined-username-input"
              label="Username"
              type="username"
              name="username"
              autoComplete="username"
              margin="normal"
              variant="outlined"
            />
          </div>
          <div className="center">
            <TextField
              id="outlined-password-input"
              label="Password"
              type="password"
              autoComplete="current-password"
              margin="normal"
              variant="outlined"
            />
          </div>
          <div className="center">
            <Button component={Link} to="/board" 
              id="signin-btn"
              variant="contained" 
              color="primary"
              size="large">
              Sign In
            </Button>
          </div>
        </Jumbotron>        
      </Container>
    )
  }
}

export default SignIn