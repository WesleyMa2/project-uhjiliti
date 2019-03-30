import React from 'react'
import Peer from 'simple-peer'

class Call extends React.Component{

  constructor(props) {
    super(props)

    this.socket = props.socket
    this.peers = {}

    this.state = {
      mediaStreams: []
    }

    getMedia({ video: true }).then((media)=> {
      const mediaObject = {
        stream: media,
        connectionInfo: this.socket.id
      }
      this.setState({mediaStreams: this.state.mediaStreams.concat(mediaObject)})
    })

    this.mediaPromise = getMedia({
      video: true,
      audio: true
    })

    this.socket.on('createPeer', (connectionInfo)=>{
      console.log(`${connectionInfo} joined the room`)
      this.peers[connectionInfo] = this.createPeer(this.mediaPromise, connectionInfo, true)
    })

    this.socket.on('signal', (data)=>{
      console.log(`${this.socket.id} recieved signal from ${data.target}`)
      if (!this.peers[data.target]) {
        this.peers[data.target] = this.createPeer(this.mediaPromise, data.target, false)
      }
      this.peers[data.target].then(peer => {
        console.log('forwarding') 
        peer.signal(data.data)
      })
    })

    this.socket.on('disconnectPeer', (connectionInfo)=> {
      console.log(`${connectionInfo} left the room`)
      this.peers[connectionInfo].then(peer => {
        this.destroyPeer(peer, connectionInfo)
      })
    })
  }

  

  createPeer(mediaPromise, target, initiator) {
    return mediaPromise.then(stream => {
      const peer = new Peer({initiator, stream})
  
      peer.on('signal', data => {
        this.socket.emit('signal', {target: target, data})
      })

      peer.on('stream', (stream)=>{
        const peerObject = {
          stream: stream,
          connectionInfo: target
        }
        this.setState({mediaStreams: this.state.mediaStreams.concat(peerObject)})
      })

      return peer
    })
  }

  destroyPeer(peer, connectionInfo) {
    // remove stream from state
    const newStreams = this.state.mediaStreams.filter((streamObject)=> {
      return streamObject.connectionInfo !== connectionInfo 
    })
    this.setState({
      mediaStreams: newStreams
    })

    // remove from peer array
    this.peers[connectionInfo] = null
    
    // destroy peer object
    peer.destroy()
  }

  componentWillUnmount() {
    // Remove socket handlers
    this.socket.off('createPeer')
    this.socket.off('signal')

    // Remove streams
    this.state.mediaStreams.forEach(streamObj=>{
      streamObj.stream.getTracks().forEach(track => {
        track.stop()})
    })

    this.mediaPromise.then(media => {
      media.getTracks().forEach(track => {
        track.stop()
      })
    })
  }

  render() {
    return ( <div style = {videoStyle}>
      {this.state.mediaStreams.map((streamObj) => (
        <Video stream={streamObj.stream}/>
      ) ) }
    </div> 
    )
  }
}

function getMedia (constraints) {
  return navigator.mediaDevices.getUserMedia(constraints)
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
    if (this.videoRef.current.srcObject !== this.props.stream) {
      this.videoRef.current.srcObject = this.props.stream
    }
  }
}

export default Call