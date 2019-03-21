import React from 'react'

class Call extends React.Component{

  constructor(props) {
    super(props)
  }

  render() {
    return ( <div style = {videoStyle}>
      {this.props.streams.map((stream) => (
        <Video stream={stream}/>
      ) ) }
    </div> 
    )
  }
}

const videoStyle = {
  backgroundColor: 'black',
  height: '55vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

class Video extends React.Component{
  constructor (props) {
    super(props)
    this.videoRef = React.createRef()
  }
    
  render () {
    return <video ref={this.videoRef} style={{height: '480px', width:'auto'}} autoPlay/>
  } 

  componentDidMount() {
    console.log(this.props.stream)
    if (this.videoRef.current.srcObject !== this.props.stream) {
      this.videoRef.current.srcObject = this.props.stream
    }
  }
}

export default Call