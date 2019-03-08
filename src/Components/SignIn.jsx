import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { Jumbotron, Container } from 'reactstrap'
import { Link } from 'react-router-dom'
import axios from '../axios'
import './SignIn.css'


function ErrorText(props) {
  if (props.error) {
    return <div className="center smallError">{props.errorMessage}</div>
  } else return null
}

class SignIn extends Component {

  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      error: false,
      errorMessage: ''
    }

    this.setUsername = this.setUsername.bind(this)
    this.setPassword = this.setPassword.bind(this)
    this.login = this.login.bind(this)
  }

  setUsername(event) {
    const value = event.target.value
    this.setState({username: value})
  }
  
  setPassword(event) {
    const value = event.target.value
    this.setState({password: value})
  }

  login() {
    axios.post('/api/auth/signin', {username: this.state.username, password: this.state.password}).then(()=>{
      window.location.href = window.location.origin + '/board'
    }).catch((err)=>{
      this.setState({error: true, errorMessage: `Error: [${err.response.status}] ${err.response.data}`})
    })
    console.log(`Login button clicked! ${this.state.username}, ${this.state.password}`)
  }

  render() {
    return (
      <Container fluid className="loginContainer verticalCenter">
        <Jumbotron className="loginForm">
          <h2 className="center">Uhjiliti</h2>
          <div className="center">
            <TextField
              id="outlined-username-input"
              label="Username"
              type="username"
              name="username"
              autoComplete="username"
              margin="normal"
              variant="outlined"
              onChange = {this.setUsername} 
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
              onChange = {this.setPassword} 
            />
          </div>
          <div className="btn-container">
            <ErrorText error={this.state.error} errorMessage={this.state.errorMessage}></ErrorText>
            <div className="center">
              <Button 
                id="signin-btn"
                variant="contained" 
                color="primary"
                size="large"
                onClick={this.login}>
              Sign In
              </Button>
            </div>
          </div>
          <div className="center">Don't have an account? Sign up <Link to="/register"> here! </Link></div>
        </Jumbotron>        
      </Container>
    )
  }
}

export default SignIn