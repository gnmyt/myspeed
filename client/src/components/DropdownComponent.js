import React, {useContext} from "react";
import "../style/Dropdown.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowDown,
    faArrowUp,
    faGaugeHigh,
    faKey,
    faPingPongPaddleBall,
    faServer
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
                title: "Optimalen Ping setzen",
                placeholder: "Ping",
                value: ping.value,
                onSuccess: value => {
                    fetch("/api/config/ping", {headers: headers, method: "PATCH", body: JSON.stringify({value: value})});
                }
            }));
    }

    const updateDownload = async () => {
        toggleDropdown();
        fetch("/api/config/download", {headers: headers}).then(res => res.json())
            .then(down => setDialog({
                title: "Optimalen Down-Speed setzen",
                placeholder: "Down-Speed",
                value: down.value,
                onSuccess: value => {
                    fetch("/api/config/download", {headers: headers, method: "PATCH", body: JSON.stringify({value: value})});
                }
            }));
    }

    const updateUpload = async () => {
        toggleDropdown();
        fetch("/api/config/upload", {headers: headers}).then(res => res.json())
            .then(up => setDialog({
                title: "Optimalen Up-Speed setzen",
                placeholder: "Up-Speed",
                value: up.value,
                onSuccess: value => {
                    fetch("/api/config/upload", {headers: headers, method: "PATCH", body: JSON.stringify({value: value})});
                }
            }));
    }

    const updatePassword = async () => {
        toggleDropdown();
        setDialog({
            title: "Neues Passwort festlegen",
            placeholder: "Neues Passwort",
            onSuccess: value => {
                fetch("/api/config/password", {headers: headers, method: "PATCH", body: JSON.stringify({value: value})});
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
                    fetch("/api/config/serverId", {headers: headers, method: "PATCH", body: JSON.stringify({value: value})});
                }
            }));
    }

    const startSpeedtest = async () => {
        toggleDropdown();
        setDialog({speedtest: true, promise: fetch("/api/speedtests/run", {headers: headers, method: "POST"})});
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
                    <div className="dropdown-item" onClick={updateDownload}>
                        <FontAwesomeIcon icon={faArrowDown}/>
                        <h3>Optimaler Down-Speed</h3>
                    </div>
                    <div className="dropdown-item" onClick={updateUpload}>
                        <FontAwesomeIcon icon={faArrowUp}/>
                        <h3>Optimaler Up-Speed</h3>
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
                </div>
            </div>
        </div>
    )
}

export default DropdownComponent;