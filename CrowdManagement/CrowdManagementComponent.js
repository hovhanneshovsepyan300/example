import React, { useState, useRef, useEffect } from "react";
import './style.scss'

import CrowdCameraComponent from "./CameraComponent/CrowdCameraComponent";
import DensityComponent from "./GraphsComponents/DensityComponent";
import FlowComponent from "./GraphsComponents/FlowComponent";
import MoodComponent from "./GraphsComponents/MoodComponent";
import CrowdMapsComponent from "./MapsComponent/CrowdMapsComponent";
import users from "../../images/icons/users.png"
import upsideArrow from "../../images/icons/upsideArrow.png"
import emotion from "../../images/icons/emotion.png"
import downloadarrow from "../../images/icons/downloadarrow.png"
import AWS from "aws-sdk";
import MulticolorProgressBar from "./GraphsComponents/MulticolorProgressBar";
import axios from "axios"
import { REGION } from "../../settings";

const CrowdManagementComponent = () => {
    let readings = [
        {
            name: 'Apples',
            value: 30,
            color: '#F1F0F0'
        },
        {
            name: 'Blueberries',
            value: 30,
            color: '#F9D94E'
        },
        {
            name: 'Guavas',
            value: 30,
            color: '#F1F0F0'
        },

    ];
    let readings1 = [
        {
            name: 'Apples',
            value: 30,
            color: '#2D822B'
        },
        {
            name: 'Blueberries',
            value: 30,
            color: '#F1F0F0'
        },
        {
            name: 'Guavas',
            value: 30,
            color: '#F1F0F0'
        },

    ];
    let readings2 = [
        {
            name: 'Apples',
            value: 30,
            color: '#F1F0F0'
        },
        {
            name: 'Blueberries',
            value: 30,
            color: '#F1F0F0'
        },
        {
            name: 'Guavas',
            value: 30,
            color: 'red'
        },

    ];
    let readings3 = [
        {
            name: 'Apples',
            value: 30,
            color: '#F9D94E'
        },
        {
            name: 'Blueberries',
            value: 30,
            color: '#F1F0F0'
        }

    ];
    const [videoLink, setVideoLink] = useState("")
    const [data, setData] = useState("")

    useEffect(() => {
        var options = {
            method: 'GET',
            url: 'https://6pisuzie9e.execute-api.us-west-2.amazonaws.com/default/halo-crowd-fetch-dynamo-db'
        };
        axios.request(options).then(function (response) {
            setData(response.data)
            console.log("Data fetched from Lambda :", response.data);
        }).catch(function (error) {
            console.error(error);
        });
    }, [])

    useEffect(() => {
        // console.log("props.data dashboard--->", props.data);
        // Step 1: Configure SDK Clients
        var options = {
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
            sessionToken: "",
            region: REGION.env,
            endpoint: process.env.REACT_APP_END_POINT,
        };

        // Step 2: Get a data endpoint for the stream
        var kinesisVideo = new AWS.KinesisVideo(options);
        var kinesisVideoArchivedContent = new AWS.KinesisVideoArchivedMedia(
            options
        );
        kinesisVideo.getDataEndpoint(
            {
                StreamName: process.env.REACT_APP_STREAM_NAME,
                APIName: process.env.REACT_APP_API_NAME,
            },
            function (err, response) {
                // console.log("response", response);
                if (err) {
                    return console.error(err);
                }
                kinesisVideoArchivedContent.endpoint = new AWS.Endpoint(
                    response.DataEndpoint
                );

                // Step 3: Get a Streaming Session URL

                kinesisVideoArchivedContent.getHLSStreamingSessionURL(
                    {
                        StreamName: "halo-crowd-kvs",
                        PlaybackMode: "LIVE",
                        HLSFragmentSelector: {
                            FragmentSelectorType: "SERVER_TIMESTAMP",
                            // TimestampRange: {
                            //         StartTimestamp:1666361305152,
                            //         EndTimestamp: new Date().getTime() + 5,
                            //       },
                        },
                        ContainerFormat: "FRAGMENTED_MP4",
                        DiscontinuityMode: "ALWAYS",
                        DisplayFragmentTimestamp: "NEVER",
                        MaxMediaPlaylistFragmentResults: 1,
                        Expires: 300,
                    },
                    function (err, response) {
                        console.log("response--->", response)
                        if (err) {
                            return console.error(err);
                        }

                        // Step 4: Give the URL to the video player.
                        var playerName = "HLS.js";
                        if (playerName == "HLS.js") {
                            //   var playerElement = videoRef.current;
                            setVideoLink(response.HLSStreamingSessionURL);
                        }
                    }
                );
            }
            // }
        );
    }, []);
    return (
        <div className="main-crowd-content">
            <div className="camera_content_sidebar">
                <div className="sidebar_card">
                    <div className="sidebar_card_header">
                        Zone name
                    </div>
                    <div className="sidebar_card_body">
                        <div className="group_list">
                            <div className="group_icon"><img src={users} alt="" /></div>
                            <div className="total_heade_count">Total head count</div>
                            <div className="total_number">| <span>175</span></div>
                        </div>
                        <div className="group_list">
                            <div className="group_icon"><img src={users} alt="" /></div>
                            <div className="total_heade_count">Total female count</div>
                            <div className="total_number">| <span>71</span></div>
                        </div>
                        <div className="group_list">
                            <div className="group_icon"><img src={users} alt="" /></div>
                            <div className="total_heade_count">Total male count</div>
                            <div className="total_number">| <span>104</span></div>
                        </div>
                        <div className="emotion_box">
                            <div className="emotion_icon"><img src={emotion} alt="" /></div>
                            <div className="emotion_text">Emotion</div>
                        </div>
                        <div className="emotion_graph_box">
                            <div className="emotion_graph">
                                <MulticolorProgressBar readings={readings} />
                            </div>
                            <div className="emotion_graph_text">
                                <div className="total_calm">Calm</div>
                                <div className="total_claim_count"><img src={downloadarrow} alt="" /> 3.5%</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sidebar_card">
                    <div className="sidebar_card_header">
                        Zone name
                    </div>
                    <div className="sidebar_card_body">
                        <div className="group_list">
                            <div className="group_icon"><img src={users} alt="" /></div>
                            <div className="total_heade_count">Total head count</div>
                            <div className="total_number">| <span>175</span></div>
                        </div>
                        <div className="group_list">
                            <div className="group_icon"><img src={users} alt="" /></div>
                            <div className="total_heade_count">Total female count</div>
                            <div className="total_number">| <span>71</span></div>
                        </div>
                        <div className="group_list">
                            <div className="group_icon"><img src={users} alt="" /></div>
                            <div className="total_heade_count">Total male count</div>
                            <div className="total_number">| <span>104</span></div>
                        </div>
                        <div className="emotion_box">
                            <div className="emotion_icon"><img src={emotion} alt="" /></div>
                            <div className="emotion_text">Emotion</div>
                        </div>
                        <div className="emotion_graph_box">
                            <div className="emotion_graph">
                                <MulticolorProgressBar readings={readings1} />
                            </div>
                            <div className="emotion_graph_text">
                                <div className="total_calm">Calm</div>
                                <div className="total_claim_count"><img src={downloadarrow} alt="" /> 3.5%</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sidebar_card">
                    <div className="sidebar_card_header">
                        Zone name
                    </div>
                    <div className="sidebar_card_body">
                        <div className="group_list">
                            <div className="group_icon"><img src={users} alt="" /></div>
                            <div className="total_heade_count">Total head count</div>
                            <div className="total_number">| <span>175</span></div>
                        </div>
                        <div className="group_list">
                            <div className="group_icon"><img src={users} alt="" /></div>
                            <div className="total_heade_count">Total female count</div>
                            <div className="total_number">| <span>71</span></div>
                        </div>
                        <div className="group_list">
                            <div className="group_icon"><img src={users} alt="" /></div>
                            <div className="total_heade_count">Total male count</div>
                            <div className="total_number">| <span>104</span></div>
                        </div>
                        <div className="emotion_box">
                            <div className="emotion_icon"><img src={emotion} alt="" /></div>
                            <div className="emotion_text">Emotion</div>
                        </div>
                        <div className="emotion_graph_box">
                            <div className="emotion_graph">
                                <MulticolorProgressBar readings={readings} />
                            </div>
                            <div className="emotion_graph_text">
                                <div className="total_calm">Calm</div>
                                <div className="total_claim_count"><img src={downloadarrow} alt="" /> 3.5%</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sidebar_card">
                    <div className="sidebar_card_header">
                        Zone name
                    </div>
                    <div className="sidebar_card_body">
                        <div className="group_list">
                            <div className="group_icon"><img src={users} alt="" /></div>
                            <div className="total_heade_count">Total head count</div>
                            <div className="total_number">| <span>175</span></div>
                        </div>
                        <div className="group_list">
                            <div className="group_icon"><img src={users} alt="" /></div>
                            <div className="total_heade_count">Total female count</div>
                            <div className="total_number">| <span>71</span></div>
                        </div>
                        <div className="group_list">
                            <div className="group_icon"><img src={users} alt="" /></div>
                            <div className="total_heade_count">Total male count</div>
                            <div className="total_number">| <span>104</span></div>
                        </div>
                        <div className="emotion_box">
                            <div className="emotion_icon"><img src={emotion} alt="" /></div>
                            <div className="emotion_text">Emotion</div>
                        </div>
                        <div className="emotion_graph_box">
                            <div className="emotion_graph">
                                <MulticolorProgressBar readings={readings} />
                            </div>
                            <div className="emotion_graph_text">
                                <div className="total_calm">Calm</div>
                                <div className="total_claim_count"><img src={downloadarrow} alt="" /> 3.5%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="camera_video_content">
                <ul className="cameralist">
                    <li>
                        <div className="camera_card">
                            <div className="camera_img">
                                <CrowdCameraComponent videoLink={videoLink} />
                                {/* <img src="https://skugal.com/img/new/blog/blog_grid_7.jpg" alt="" /> */}
                                <p class="camera_text_heading">Cam 14</p>
                                <p class="camera_text_time">02:33:33</p>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="camera_card">
                            <div className="camera_img">
                                <CrowdCameraComponent videoLink={videoLink} />
                                {/* <img src="https://skugal.com/img/new/blog/blog_grid_7.jpg" alt="" /> */}
                                <p class="camera_text_heading">Cam 14</p>
                                <p class="camera_text_time">02:33:33</p>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="camera_card">
                            <div className="camera_img">
                                {/* <img src="https://skugal.com/img/new/blog/blog_grid_7.jpg" alt="" /> */}
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.892427392686!2d77.21718531508259!3d28.63298598241769!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd37ebbdf4af%3A0x2be7eefccedf4b84!2sRajiv%20Chowk!5e0!3m2!1sen!2sin!4v1666088572430!5m2!1sen!2sin"
                                    width="100%"
                                    height="450"
                                    allowfullscreen=""
                                    loading="lazy"
                                    referrerpolicy="no-referrer-when-downgrade"
                                ></iframe>
                                {/* <p class="camera_text_heading">Cam 14</p>
                                    <p class="camera_text_time">02</p> */}
                            </div>
                        </div>
                    </li>
                </ul>
                <ul className="cameragraph_list">
                    <li>
                        <div className="camera_card_graph">
                            <div className="camera_card_heading">
                                <span><img src={users} /></span> Density
                            </div>
                            <div className="camera_card_body">
                                <div className="density-card-left">
                                    <div className="">
                                        <span>1.92</span>
                                        <span style={{ fontSize: "12px", marginLeft: "10px" }}>PEOPLE/M²</span>
                                        <img src={upsideArrow} />
                                        <div className="multi_color_progressbar">
                                            <MulticolorProgressBar readings={readings2} />
                                        </div>
                                    </div>
                                    <div className="">
                                        <span>332</span>
                                        <span style={{ fontSize: "12px", marginLeft: "10px" }}>PAX</span>
                                        <img src={upsideArrow} />
                                        <div className="multi_color_progressbar">
                                            <MulticolorProgressBar readings={readings3} />
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="camera_card_graph">
                            <div className="camera_card_heading">
                                <span><img src={users} /></span> Density
                            </div>
                            <div className="camera_card_body">
                                <span className="rotate">Head Count</span>
                                <DensityComponent data={data} />
                            </div>
                        </div>
                    </li>
                </ul>
                <ul className="cameragraph_list">
                    <li>
                        <div className="camera_card_graph">
                            <div className="camera_card_heading">
                                <span><img src={users} /></span> Flow
                            </div>
                            <div className="camera_card_body">
                                <div className="density-card-left">
                                    <div className="">
                                        <span>1.92</span>
                                        <span style={{ fontSize: "12px" }}>MTS/SEC²</span>
                                        <img src={upsideArrow} />
                                        <div className="multi_color_progressbar">
                                            <MulticolorProgressBar readings={readings1} />
                                        </div>
                                    </div>
                                    <div className="">
                                        <span>32</span>
                                        <span style={{ fontSize: "12px" }}>AGE</span>
                                        <img src={downloadarrow} />
                                        <div className="multi_color_progressbar">
                                            <MulticolorProgressBar readings={readings3} />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="camera_card_graph">
                            <div className="camera_card_heading">
                                <span><img src={users} /></span> Flow
                            </div>
                            <div className="camera_card_body">
                                <span className="rotate">Flow (m/s)</span>
                                <FlowComponent data={data} />
                            </div>
                        </div>
                    </li>
                </ul>
                <ul className="cameragraph_list">
                    <li>
                        <div className="camera_card_graph">
                            <div className="camera_card_heading">
                                <span><img src={users} /></span> Emotion
                            </div>
                            <div className="camera_card_body">
                                <div className="density-card-left baseline-alignment">
                                    <span>Calm</span>
                                    <span style={{ Weight: 300, fontSize: "17px" }} className="total_claim_count">5.2 <img src={downloadarrow} style={{ marginLeft: "5px" }} /></span>

                                </div>
                                <div className="multi_color_progressbar">
                                    <MulticolorProgressBar readings={readings} />
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="camera_card_graph">
                            <div className="camera_card_heading">
                                <span><img src={users} /></span> Mood
                            </div>
                            <div className="camera_card_body">
                                <span className="rotate" style={{ marginLeft: "-12px", fontSize: "10px" }}>Emotion</span>
                                <MoodComponent data={data} />
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default CrowdManagementComponent