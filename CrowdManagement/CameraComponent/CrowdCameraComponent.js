import React, { useState, useRef, useEffect } from 'react'
import './CrowdCameraComponent.scss'

import ReactHlsPlayer from 'react-hls-player/dist'

const CrowdCameraComponent = props => {
  const [videoLink, setVideoLink] = useState('')
  const videoRef = useRef(null)

  useEffect(() => {
    console.log('propssss', props.videoLink)
  })

  return (
    <div>
      <ReactHlsPlayer
        id="cam-2"
        src={props.videoLink}
        autoPlay={true}
        controls={true}
        width="100%"
        height="275px"
      />
    </div>
  )
}

export default CrowdCameraComponent
