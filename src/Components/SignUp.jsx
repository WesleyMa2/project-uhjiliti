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

class SignUp extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      username: '',
      password: '',
      error: false,
      errorMessage: ''
    }
    
    this.setName = this.setName.bind(this)
    this.setUsername = this.setUsername.bind(this)
    this.setPassword = this.setPassword.bind(this)
    this.register = this.register.bind(this)
  }
    
  setUsername(event) {
    const value = event.target.value
    this.setState({username: value})
  }

  setName(event) {
    const value = event.target.value
    this.setState({name: value})
  }

  setPassword(event) {
    const value = event.target.value
    this.setState({password: value})
  }
    
  register() {
    axios.post('/api/auth/signup', {name: this.state.name, username: this.state.username, password: this.state.password}).then(()=>{
      window.location.href = window.location.origin + '/board'
    }).catch((err)=>{
      let data = err.response.data;
      // if theres a validation error show the messages
      if (err.response.status === 422) {
        let list = '';
        let sep = '';
        data.errors.forEach( (err) => {
          list += (sep + err.msg);
          sep = ', ';
        });
        data = list
      }
      this.setState({error: true, errorMessage: `Error: [${err.response.status}] ${data}`})
    })
    console.log(`Login button clicked! ${this.state.username}, ${this.state.name}, ${this.state.password}`)
  }
    
  render() {
    return (
      <Container fluid className="loginContainer verticalCenter">
        <Jumbotron className="loginForm">
          <h2 className="center">Uhjiliti</h2>
          <div className="center">
            <TextField
              id="outlined-name-input"
              label="Full name"
              type="name"
              name="name"
              autoComplete="full name"
              margin="normal"
              variant="outlined"
              onChange = {this.setName}
            />
          </div>
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
                onClick={this.register}>
                  Register
              </Button>
            </div>
          </div>
          <div className="center">Already have an account? Click <Link to="/signin"> here! </Link></div>
        </Jumbotron>        
      </Container>
    )
  }
}

export default SignUp
