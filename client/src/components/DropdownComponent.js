import React, {useContext} from "react";
import "../style/Dropdown.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowDown,
    faArrowUp,
    faGaugeHigh, faInfo,
    faKey,
    faPingPongPaddleBall,
    faServer, faWandMagicSparkles
} from "@fortawesome/free-solid-svg-icons";
import {DialogContext} from "../context/DialogContext";

export const toggleDropdown = () => {
    let classList = document.getElementsByClassName("dropdown")[0].classList;
    if (classList.contains("dropdown-invisible")) {
        classList.remove("dropdown-invisible");
    } else {
        classList.add("dropdown-invisible");
    }
}

function DropdownComponent() {

    const [setDialog] = useContext(DialogContext);
    let headers = localStorage.getItem("password") ? {password: localStorage.getItem("password")} : {}
    headers['content-type'] = 'application/json'

    const updatePing = async () => {
        toggleDropdown();
        fetch("/api/config/ping", {headers: headers}).then(res => res.json())
            .then(ping => setDialog({
                title: "Optimalen Ping setzen (ms)",
                placeholder: "Ping",
                value: ping.value,
                onSuccess: value => {
                    fetch("/api/config/ping", {headers: headers, method: "PATCH", body: JSON.stringify({value: value})})
                        .then(() => showFeedback());
                }
            }));
    }

    const updateDownload = async () => {
        toggleDropdown();
        fetch("/api/config/download", {headers: headers}).then(res => res.json())
            .then(down => setDialog({
                title: "Optimalen Down-Speed setzen (Mbit/s)",
                placeholder: "Down-Speed",
                value: down.value,
                onSuccess: value => {
                    fetch("/api/config/download", {headers: headers, method: "PATCH", body: JSON.stringify({value: value})})
                        .then(() => showFeedback());
                }
            }));
    }

    const updateUpload = async () => {
        toggleDropdown();
        fetch("/api/config/upload", {headers: headers}).then(res => res.json())
            .then(up => setDialog({
                title: "Optimalen Up-Speed setzen (Mbit/s)",
                placeholder: "Up-Speed",
                value: up.value,
                onSuccess: value => {
                    fetch("/api/config/upload", {headers: headers, method: "PATCH", body: JSON.stringify({value: value})})
                        .then(() => showFeedback());
                }
            }));
    }

    const updatePassword = async () => {
        toggleDropdown();
        setDialog({
            title: "Neues Passwort festlegen",
            placeholder: "Neues Passwort",
            password: true,
            unsetButton: true,
            unsetButtonText: "Sperre aufheben",
            onClear: () => {
                fetch("/api/config/password", {headers: headers, method: "PATCH", body: JSON.stringify({value: "none"})})
                    .then(() => showFeedback(<>Die Passwortsperre wurde aufgehoben.</>));
                localStorage.removeItem("password");
            },
            onSuccess: value => {
                fetch("/api/config/password", {headers: headers, method: "PATCH", body: JSON.stringify({value: value})})
                    .then(() => showFeedback());
                localStorage.setItem("password", value);
            }
        })
    }

    const updateServer = async () => {
        toggleDropdown();
        fetch("/api/config/serverId", {headers: headers}).then(res => res.json())
            .then(ping => setDialog({
                title: "Speedtest-Server setzen",
                placeholder: "Server-ID",
                value: ping.value,
                onSuccess: value => {
                    fetch("/api/config/serverId", {headers: headers, method: "PATCH", body: JSON.stringify({value: value})})
                        .then(() => showFeedback());
                }
            }));
    }

    const startSpeedtest = async () => {
        toggleDropdown();
        setDialog({speedtest: true, promise: fetch("/api/speedtests/run", {headers: headers, method: "POST"})});
    }

    const showCredits = () => {
        toggleDropdown();
        setDialog({title: "MySpeed", description: <><a href="https://github.com/gnmyt/myspeed" target="_blank">MySpeed</a> wird von GNMYT bereitgestellt
                und verwendet die <a href="https://www.speedtest.net/apps/cli" target="_blank">Speedtest-CLI</a> von Ookla.</>, buttonText: "Schließen"});
    }

    const showFeedback = (customText) => {
        setDialog({title: "MySpeed", description: customText || <>Deine Änderungen wurden übernommen.</>, buttonText: "Okay"});
    }

    const recommendedSettings = async () => {
        toggleDropdown();
        fetch("/api/recommendations", {headers: headers}).then(res => res.json())
            .then(values => values.message !== undefined ? setDialog({
                title: "Automatische Empfehlungen",
                description: <>Du musst mindestens 10 Tests machen, damit ein Durchschnitt ermittelt werden kann. Ob die
                    Tests manuell oder automatisch durchgeführt wurden ist egal.
                </>,
                buttonText: "Okay"
            }) : setDialog({
                title: "Automatische Empfehlungen setzen?",
                description: <>Anhand der letzten 10 Testergebnisse wurde festgestellt, dass der optimale Ping bei <span
                    className="dialog-value">
                    {values.ping} ms</span>, der Download bei <span
                    className="dialog-value">{values.download} Mbit/s </span>
                    und der Upload bei <span className="dialog-value">{values.upload} Mbit/s</span> liegt. <br/>
                    Orientiere dich am besten an deinem Internetvertrag und übernehme es nur, wenn es mit dem
                    übereinstimmt.</>,
                buttonText: "Ja, übernehmen",
                onSuccess: async () => {
                    await fetch("/api/config/ping", {headers: headers, method: "PATCH", body: JSON.stringify({value: values.ping})});
                    await fetch("/api/config/download", {headers: headers, method: "PATCH", body: JSON.stringify({value: values.download})});
                    await fetch("/api/config/upload", {headers: headers, method: "PATCH", body: JSON.stringify({value: values.upload})});
                    showFeedback();
                }
            }));
    }

    return (
        <div className="dropdown dropdown-invisible">
            <div id="dropdown" className="dropdown-content">
                <h2>Einstellungen</h2>
                <div className="dropdown-entries">
                    <div className="dropdown-item" onClick={updatePing}>
                        <FontAwesomeIcon icon={faPingPongPaddleBall}/>
                        <h3>Optimaler Ping</h3>
                    </div>
                    <div className="dropdown-item" onClick={updateUpload}>
                        <FontAwesomeIcon icon={faArrowUp}/>
                        <h3>Optimaler Up-Speed</h3>
                    </div>
                    <div className="dropdown-item" onClick={updateDownload}>
                        <FontAwesomeIcon icon={faArrowDown}/>
                        <h3>Optimaler Down-Speed</h3>
                    </div>
                    <div className="dropdown-item" onClick={recommendedSettings}>
                        <FontAwesomeIcon icon={faWandMagicSparkles}/>
                        <h3>Optimale Werte</h3>
                    </div>
                    <div className="center">
                        <hr className="dropdown-hr"/>
                    </div>
                    <div className="dropdown-item" onClick={updateServer}>
                        <FontAwesomeIcon icon={faServer}/>
                        <h3>Server wechseln</h3>
                    </div>
                    <div className="dropdown-item" onClick={updatePassword}>
                        <FontAwesomeIcon icon={faKey}/>
                        <h3>Passwort ändern</h3>
                    </div>
                    <div className="dropdown-item" onClick={startSpeedtest}>
                        <FontAwesomeIcon icon={faGaugeHigh}/>
                        <h3>Speedtest starten</h3>
                    </div>
                    <div className="dropdown-item" onClick={showCredits}>
                        <FontAwesomeIcon icon={faInfo}/>
                        <h3>Info</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DropdownComponent;