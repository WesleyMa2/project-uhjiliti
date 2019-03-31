import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Slide from '@material-ui/core/Slide'
import lightGreen from '@material-ui/core/colors/lightGreen'
import red from '@material-ui/core/colors/red'
import orange from '@material-ui/core/colors/orange'

// Custom column header
export const CustomLaneHeader = props => {  
  return (
    <div style={{cursor: 'pointer'}}>
      <header>
        <Typography variant="h5" noWrap>{props.title}</Typography>
      </header>
    </div>
  )
}
// Custom card layout
export const CustomCard = props => {
  let color = 'textPrimary'
  let nameStyle = props.assignee
  let cardStyle = {}
  const isAssigned = props.assignee === window.localStorage.getItem('username')
  const isWatching = props.watchers.includes(window.localStorage.getItem('username'))
  if (isAssigned) {
    nameStyle = <strong>{props.assignee}</strong>
  }
  if (isWatching || isAssigned) {
    cardStyle['backgroundColor'] = lightGreen[300]
  }
  let currDate = new Date()
  let cardDate = new Date(props.date)
  if ((cardDate - currDate) / (1000 * 3600 * 24) <= 0) cardStyle['backgroundColor'] = red[400]
  else if ((cardDate - currDate) / (1000 * 3600 * 24) <= 2) cardStyle['backgroundColor'] = orange[300]


  return (
    <Slide direction="up" in mountOnEnter unmountOnExit>
      <Card className="card" style={cardStyle}>
        <CardContent style={{padding: 10}}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Typography variant="overline" color={color}>{nameStyle}</Typography>
            <Typography variant="overline">{props.date}</Typography>
          </div>
          <Typography variant="h6" noWrap>{props.title}</Typography>
          <Typography variant="body1" noWrap>
            {props.description}
          </Typography>
        </CardContent>
      </Card>
    </Slide>
  )
}
