import React, { useState } from 'react';
import PropTypes from "prop-types";
import Button from './Button/Button';

export const IVSPlayerView = (props) => {
    const IVSPlayerRef = React.useRef(null)
    const [ref, setRef] = useState(null)

    React.useEffect(() => {
        if (IVSPlayerRef && !ref) { //create player if player exists and it does not have data
            let script = document.createElement('script');
            script.src = "https://player.live-video.net/1.13.0/amazon-ivs-player.min.js"
            script.async = true
            document.body.appendChild(script)

            script.onload = () => {
                const { IVSPlayer } = window
                const player = IVSPlayer.create();
                player.attachHTMLVideoElement(document.getElementById('amazon-ivs-player'));
                player.load(props.videoSrc);
                if(props.autoPlay){
                    player.play();
                }
            }
            const node = IVSPlayerRef.current
            node.appendChild(script);
            setRef(node)

        }/* else if(IVSPlayerRef && IVSPlayerRef.current.readyState === 0 && ref){
            const player = document.getElementById('amazon-ivs-player')
            console.log('trying again', player)
            player.load(props.videoSrc);
            player.play();
            setRef(1)
        } else{
            console.log('everything alright')
        }*/
    });
    const refresh = () =>{
        if(typeof ref === 'number'){
            setRef(ref + 1)
        }else{
            setRef(1)
        }
    }

    return (
        <>
        <video id='amazon-ivs-player'
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                    ref={IVSPlayerRef} playsInline {...props} />
            {/*IVSPlayerRef.current && IVSPlayerRef.current.readyState !== 0 ?
                <>
                    <video id='amazon-ivs-player'
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                    ref={IVSPlayerRef} controls autoPlay playsInline />
                </> :
                <>
                    <video id='amazon-ivs-player'
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'none'
                        }}
                        ref={IVSPlayerRef} controls autoPlay playsInline />
                    <div style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        fontSize: '30px',
                        textAlign: 'center'
                    }}
                    >Offline</div>
                    <button
                    onClick={()=>{refresh()}}
                    >refresh</button>
                </>
            */}
        </>
    );
}


export default IVSPlayerView;