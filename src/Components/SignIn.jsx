import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { Container } from 'reactstrap'
import './SignIn.css'


class SignIn extends Component {
  render() {
    return (
      <Container fluid className="loginContainer verticalCenter">
        <div className="loginForm">
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
            <Button 
              variant="contained" 
              color="primary"
              size="large">
        Sign In
            </Button>
          </div>
        </div>        
      </Container>
    )
  }
}

export default SignIn