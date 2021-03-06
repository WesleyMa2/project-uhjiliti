import React from 'react'
import { Route, Link } from 'react-router-dom'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import AppBar from '@material-ui/core/AppBar'
import Board from './Components/Project Board/ProjectBoard'
import Chat from './Components/Chat/Chat'
import ProjectInfo from './Components/ProjectInfo'
import Typography from '@material-ui/core/Typography'
import ProjectMenu from './Components/ProjectMenu'
import createBrowserHistory from 'history/createBrowserHistory'
import ExitToApp from '@material-ui/icons/ExitToApp'
import IconButton from '@material-ui/core/IconButton'
import CreateNewFolder from '@material-ui/icons/CreateNewFolder'
import axios from './axios'
const history = createBrowserHistory()

const styles = {
  title: {
    paddingTop: '10px',
    paddingLeft: '2rem',
    paddingRight: '2rem'
  },
  centerTabs: {
    justifySelf: 'center'
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
    this.newProject = this.newProject.bind(this)
  }
  // Sets the correct highlighted tab on load
  componentDidMount() {
    let currPath = window.location.pathname
    if (currPath.split('/')[3] === 'chat') this.setState({ selectedTab: 4 })
    else this.setState({ selectedTab: 3 })
  }

  // Set the current project
  setCurrProject(value) {
    this.setState({ currentProject: value })
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

  newProject(event) {
    event.preventDefault()
    window.location.href = '/newProject'
  }

  signout(event) {
    event.preventDefault()
    window.location.replace('/')
    localStorage.clear()
    axios.get('/api/auth/signout/')
  }

  render() {
    const { selectedTab } = this.state
    return (
      <div>
        <AppBar position="fixed">
          <Tabs value={selectedTab} onChange={this.handleChange}>
            <Typography style={styles.title} variant="h5" color="inherit" noWrap>
              Uhjiliti
            </Typography>
            <ProjectMenu onSelect={this.setCurrProject} />
            <ProjectInfo currentProject={this.state.currentProject}/>
            <Tab label="Board" style={styles.centerTabs} component={Link} to={`/project/${this.state.currentProject}/board`} />
            <Tab label="Chat" style={styles.centerTabs} component={Link} to={`/project/${this.state.currentProject}/chat`} />
            <div style={{ flexGrow: 1 }} />
            <IconButton onClick={this.newProject} color="inherit">
              <CreateNewFolder />
            </IconButton>
            <IconButton onClick={this.signout} color="inherit">
              <ExitToApp />
            </IconButton>
          </Tabs>
        </AppBar>
        <div id="app-container" ref="board">
          <Route path={'/project/*/board'} render={() => <Board projectId={this.state.currentProject} />} />
          <Route path={'/project/*/chat'} exact render={() => <Chat currentProject={this.state.currentProject} />} />
        </div>
      </div>
    )
  }
}

export default App
