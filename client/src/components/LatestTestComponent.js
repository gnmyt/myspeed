import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown, faArrowUp, faClockRotateLeft, faPingPongPaddleBall} from "@fortawesome/free-solid-svg-icons";
import "../style/LatestTest.sass";
import {generateRelativeTime, getIconBySpeed} from "../HelperFunctions";
import {useContext, useEffect, useState} from "react";
import {ConfigContext} from "../context/ConfigContext";

function LatestTestComponent() {
    const [latest, setLatest] = useState({});
    const config = useContext(ConfigContext);

    useEffect(() => {
        let passwordHeaders = localStorage.getItem("password") ? {password: localStorage.getItem("password")} : {}
        fetch("/api/speedtests/latest", {headers: passwordHeaders})
            .then(res => res.json())
            .then(latest => setLatest(latest));

    }, [setLatest]);

    if (Object.entries(config).length === 0) return (<></>)

    return (
        <div className="analyse-area">
            {/* Ping */}
            <div className="inner-container">
                <div className="container-header">
                    <FontAwesomeIcon icon={faPingPongPaddleBall}
                                     className={"container-icon icon-" + getIconBySpeed(latest.ping, config.ping, false)}/>
                    <h2 className="container-text">Ping<span className="container-subtext">ms</span></h2>
                </div>
                <div className="container-main">
                    <h2>{latest.ping === 0 ? "Test" : latest.ping}</h2>
                </div>
            </div>

            {/* Download */}
            <div className="inner-container">
                <div className="container-header">
                    <FontAwesomeIcon icon={faArrowDown}
                                     className={"container-icon icon-" + getIconBySpeed(latest.download, config.download, true)}/>
                    <h2 className="container-text">Download<span className="container-subtext">Mbps</span></h2>
                </div>
                <div className="container-main">
                    <h2>{latest.download === 0 ? "schlug" : latest.download}</h2>
                </div>
            </div>

            {/* Upload */}
            <div className="inner-container">
                <div className="container-header">
                    <FontAwesomeIcon icon={faArrowUp}
                                     className={"container-icon icon-" + getIconBySpeed(latest.upload, config.upload, true)}/>
                    <h2 className="container-text">Upload<span className="container-subtext">Mbps</span></h2>
                </div>
                <div className="container-main">
                    <h2>{latest.upload === 0 ? "fehl!" : latest.upload}</h2>
                </div>
            </div>

            {/* Latest update */}
            <div className="inner-container">
                <div className="container-header">
                    <FontAwesomeIcon icon={faClockRotateLeft} className="container-icon icon-blue"/>
                    <h2 className="container-text">Letzter Test<span className="container-subtext">vor</span></h2>
                </div>
                <div className="container-main">
                    <h2>{generateRelativeTime(latest.created)}</h2>
                </div>
            </div>
        </div>
    )
}

export default LatestTestComponent;