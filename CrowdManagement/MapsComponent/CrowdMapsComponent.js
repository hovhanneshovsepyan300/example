import React, { useState, useRef, useEffect } from "react";
import "./CrowdMapsComponent.scss";

import ReactHlsPlayer from "react-hls-player/dist";

const CrowdMapsComponent = (props) => {
    const [videoLink, setVideoLink] = useState("");
    const videoRef = useRef(null);

    useEffect(() => {

    });

    return (
        <div>
            <ReactHlsPlayer
                id="cam-2"
                src={videoLink}
                autoPlay={true}
                controls={true}
                width="100%"
                height="auto"
            />
        </div>
    )


}

export default CrowdMapsComponent
