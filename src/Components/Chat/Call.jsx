import React from 'react'

class Call extends React.Component{

  constructor(props) {
    super(props)

    this.state = {
      video: undefined
    }
  }

  render() {
    return ( <div>
      {this.props.streams.map((stream) => (
        <Video stream={stream}/>
      ) ) }
    </div> 
    )
  }
}

class Video extends React.Component{
  constructor (props) {
    super(props)
    this.videoRef = React.createRef()
  }
    
  render () {
    return <video ref={this.videoRef} style={{backgroundColor: 'black'}} autoPlay></video>
  } 

  componentDidMount() {
    console.log(this.props.stream)
    if (this.videoRef.current.srcObject !== this.props.stream) {
      this.videoRef.current.srcObject = this.props.stream
    }
  }
}

export default Call