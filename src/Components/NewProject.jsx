import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
// import Input from '@material-ui/core/Input'
import Button from '@material-ui/core/Button'
import { Jumbotron, Container } from 'reactstrap'
// import { Link } from 'react-router-dom'
import axios from '../axios'
import './SignIn.css'


function ErrorText(props) {
  if (props.error) {
    return <div className="center smallError">{props.errorMessage}</div>
  } else return null
}

class NewProject extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      description: '',
      error: false,
      errorMessage: ''
    }

    this.setName = this.setName.bind(this)
    this.setDescription = this.setDescription.bind(this)
    this.createProject = this.createProject.bind(this)
  }

  setName(event) {
    const value = event.target.value
    this.setState({name: value})
  }
  
  setDescription(event) {
    const value = event.target.value
    this.setState({description: value})
  }

  createProject() {

    axios.post('/api/projects/', {name: this.state.name, description: this.state.description}).then(()=>{
      // FIGURE OUT WHAT TO DO ON POST
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
    console.log(`Create button clicked! ${this.state.name}, ${this.state.description}`)
  }

  render() {
    return (
      <Container fluid className="loginContainer verticalCenter">
        <Jumbotron className="createProjectForm">
          <h2>Create New Project</h2>
          <div>
            <TextField
              id="outlined-name-input"
              label="Name"
              type="username"
              name="username"
              autoComplete="name"
              style={{ margin: 8 }}
              InputLabelProps={{
                shrink: true,
              }}
              onChange = {this.setName} 
            />
          </div>
          <TextField
            id="description"
            label="Description"
            style={{ margin: 8 }}
            placeholder="Description"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            onChange = {this.setDescription} 
          />
          <div className="btn-container">
            <ErrorText error={this.state.error} errorMessage={this.state.errorMessage}></ErrorText>
            <div className="center">
              <Button 
                id="signin-btn"
                variant="contained" 
                color="primary"
                size="large"
                onClick={this.createProject}>
              Create!
              </Button>
            </div>
          </div>
        </Jumbotron>        
      </Container>
    )
  }
}

export default NewProject