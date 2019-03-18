import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Slide from '@material-ui/core/Slide'


export const CustomLaneHeader = props => {  
  return (
    <div style={{cursor: 'pointer'}}>
      <header>
        <Typography variant="h5" noWrap>{props.title}</Typography>
      </header>
    </div>
  )
}
export const CustomCard = props => {
  console.log(props)
  let color = 'textPrimary'
  if (props.assignee === window.localStorage.getItem('username')) color = 'secondary'
  return (
    <Slide direction="up" in mountOnEnter unmountOnExit>
      <Card className="card" >
        <CardContent style={{padding: 10}}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Typography variant="caption" color={color}>{props.assignee}</Typography>
            <Typography variant="caption">{props.date}</Typography>
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
