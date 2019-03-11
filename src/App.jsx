import React from 'react'
import { Route, Link, Switch } from 'react-router-dom'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import AppBar from '@material-ui/core/AppBar'
import Board from './Components/ProjectBoard'
import Typography from '@material-ui/core/Typography'
import ProjectMenu from './Components/ProjectMenu'

function Chat() {
  return <h2>Chat</h2>
}

const styles = {
  title: {
    paddingTop: '10px',
    paddingLeft: '2rem',
    paddingRight: '2rem'
  }
}

// Compontent holding main app
class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedTab: 0
    }
    this.handleChange = this.handleChange.bind(this)
  }

  // Changes the highlighted tab
  handleChange(event, value) {
    this.setState({ selectedTab: value })
  }
  // Sets the correct highlighted tab on load
  componentDidMount() {
    let currPath = this.props.location.pathname
    if (currPath === '/chat') this.setState({ selectedTab: 4 })
    else this.setState({ selectedTab: 3 }) 
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
            <ProjectMenu />
            <div style={{ grow: 1 }}></div>
            <Tab label="Board" component={Link} to="/board" />
            <Tab label="Chat" component={Link} to="/chat" />
          </Tabs>
        </AppBar>
        <div id="app-container">
          <Switch>
            <Route path="/board" component={Board} />
            <Route path="/chat" exact component={Chat} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default App
