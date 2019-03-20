import React from 'react'

class Call extends React.Component{

  constructor(props) {
    super(props)

    this.state = {
      video: undefined
    }

    getMedia({video: true, audio:true}).then(mediaSource => {
      this.setState({video: mediaSource})
    })
  }

  render() {
    return (<Video stream={this.state.video}/>)
  }

}

function getMedia (constraints) {
  return navigator.mediaDevices.getUserMedia(constraints)
}

class Video extends React.Component{
  constructor (props) {
    super(props)
    this.videoRef = React.createRef()

    
  }
    
  render () {
    return <video ref={this.videoRef} style={{backgroundColor: 'black'}} autoPlay></video>
  } 

  componentDidUpdate() {
    if (this.videoRef.current.srcObject !== this.props.stream) {
      this.videoRef.current.srcObject = this.props.stream
    }
  }
}

export default Call