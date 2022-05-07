import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown, faArrowUp, faClockRotateLeft, faPingPongPaddleBall} from "@fortawesome/free-solid-svg-icons";
import "../style/LatestTest.sass";
import {generateRelativeTime, getIconBySpeed} from "../HelperFunctions";
import {useContext, useEffect, useState} from "react";
import {ConfigContext} from "../context/ConfigContext";
import {DialogContext} from "../context/DialogContext";

function LatestTestComponent() {
    const [latest, setLatest] = useState({});
    const [setDialog] = useContext(DialogContext);
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
                    <FontAwesomeIcon onClick={() => setDialog({title: "Ping", description: "Der Ping zeigt dir, wie schnell der jeweilige Anbieter antwortet. " +
                            "Umso kürzer die Zeit, desto besser.", buttonText: "Okay"})}
                                     icon={faPingPongPaddleBall} className={"container-icon help-icon icon-" + getIconBySpeed(latest.ping, config.ping, false)}/>
                    <h2 className="container-text">Ping<span className="container-subtext">ms</span></h2>
                </div>
                <div className="container-main">
                    <h2>{latest.ping === 0 ? "Test" : latest.ping}</h2>
                </div>
            </div>

            {/* Download */}
            <div className="inner-container">
                <div className="container-header">
                    <FontAwesomeIcon onClick={() => setDialog({title: "Download-Geschwindigkeit", description: "Die Downloadgeschwindigkeit wirkt sich " +
                            "auf dein Surferlebnis aus. Umso mehr du bekommst, desto besser und stabiler ist das Internet. " +
                            "Achte hierbei auch auf den Internetvertrag und prüfe, ob die Bedingungen erfüllt werden. " +
                            "Du kannst nur so viel bekommen, wie dein Anbieter auch verspricht.", buttonText: "Okay"})}
                                     icon={faArrowDown} className={"container-icon help-icon icon-" + getIconBySpeed(latest.download, config.download, true)}/>
                    <h2 className="container-text">Download<span className="container-subtext">Mbit/s</span></h2>
                </div>
                <div className="container-main">
                    <h2>{latest.download === 0 ? "schlug" : latest.download}</h2>
                </div>
            </div>

            {/* Upload */}
            <div className="inner-container">
                <div className="container-header">
                    <FontAwesomeIcon onClick={() => setDialog({title: "Upload-Geschwindigkeit", description: "Die Uploadgeschwindigkeit wirkt sich " +
                            "auf dein Surferlebnis aus. Umso mehr du bekommst, desto besser und stabiler ist das Internet. " +
                            "Achte hierbei auch auf den Internetvertrag und prüfe, ob die Bedingungen erfüllt werden. " +
                            "Du kannst nur so viel bekommen, wie dein Anbieter auch verspricht.", buttonText: "Okay"})}
                                     icon={faArrowUp} className={"container-icon help-icon icon-" + getIconBySpeed(latest.upload, config.upload, true)}/>
                    <h2 className="container-text">Upload<span className="container-subtext">Mbit/s</span></h2>
                </div>
                <div className="container-main">
                    <h2>{latest.upload === 0 ? "fehl!" : latest.upload}</h2>
                </div>
            </div>

            {/* Latest update */}
            <div className="inner-container">
                <div className="container-header">
                    <FontAwesomeIcon onClick={() => setDialog({title: "Letzter Test", description: "Dies ist die Zeit, die dir zeigt, wann der letzte Test " +
                            "ausgeführt wurde. In diesem Fall wurde der letzte Test am " + new Date(latest.created).toLocaleDateString("de-DE") + " um " +
                            new Date(latest.created).toLocaleTimeString("de-DE", {hour: "2-digit", minute: "2-digit"}) + " ausgeführt.",
                        buttonText: "Okay"})}
                        icon={faClockRotateLeft} className="container-icon icon-blue help-icon"/>
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