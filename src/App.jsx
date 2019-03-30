import React from 'react'
import { Route, Link } from 'react-router-dom'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import AppBar from '@material-ui/core/AppBar'
import Board from './Components/Project Board/ProjectBoard'
import Chat from './Components/Chat/Chat'
import Typography from '@material-ui/core/Typography'
import ProjectMenu from './Components/ProjectMenu'
import createBrowserHistory from 'history/createBrowserHistory'
import ExitToApp from '@material-ui/icons/ExitToApp'
import Info from '@material-ui/icons/Info'
import { IconButton } from '@material-ui/core'

const history = createBrowserHistory()

const styles = {
  title: {
    paddingTop: '10px',
    paddingLeft: '2rem',
    paddingRight: '2rem'
  }
}

// Component holding main app
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentProject: null,
      selectedTab: 0
    }
    this.handleChange = this.handleChange.bind(this)
    this.setCurrProject = this.setCurrProject.bind(this)
    this.signout = this.signout.bind(this)

  }

  // Set the current project
  setCurrProject(value) {
    this.setState({currentProject: value})
    const url = history.location.pathname.split('/')
    url[2] = value
    const newUrl = url.join('/')
    history.replace(newUrl)
    localStorage.setItem('currProject', value)
    this.forceUpdate()
  }

  // Changes the highlighted tab
  handleChange(event, value) {
    this.setState({ selectedTab: value })
  }
  // Sets the correct highlighted tab on load
  componentDidMount() {
    let currPath = window.location.pathname    
    if (currPath.split('/')[3] === 'chat') this.setState({ selectedTab : 4 })
    else this.setState({ selectedTab: 3 }) 
  }

  signout(event) {
    event.preventDefault()
    window.location.replace('/')
    localStorage.clear()
  }

  render() {
    const { selectedTab } = this.state
    return (
      <div>
        <AppBar position="fixed">
          <Tabs value={selectedTab} onChange={this.handleChange} >
            <Typography style={styles.title} variant="h5" color="inherit" noWrap>
              Uhjiliti
            </Typography>
            <ProjectMenu onSelect={this.setCurrProject}/>
            <Tab label="Board" component={Link} to={`/project/${this.state.currentProject}/board`} />
            <Tab label="Chat" component={Link} to={`/project/${this.state.currentProject}/chat`} />
            <div style={{ flexGrow: 1 }}></div>
            <IconButton color="inherit"><Info/></IconButton>
            <IconButton onClick={this.signout} color="inherit"><ExitToApp/></IconButton>
          </Tabs>
        </AppBar>
        <div id="app-container" ref="board">
          <Route path={'/project/*/board'} render={() => <Board projectId={this.state.currentProject}/>} />
          <Route path={'/project/*/chat'} exact render={()=> <Chat currentProject={this.state.currentProject}/>} />
        </div>
      </div>
    )
  }
}

export default App
