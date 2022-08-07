import React, {useContext} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowDown,
    faArrowUp,
    faClockRotateLeft,
    faClose, faInfo,
    faPingPongPaddleBall
} from "@fortawesome/free-solid-svg-icons";
import "../style/Speedtest.sass";
import {DialogContext} from "../context/DialogContext";
import {SpeedtestContext} from "../context/SpeedtestContext";

const errors = {
    "Network unreachable": "Die Internetverbindung scheint unterbrochen gewesen zu sein",
    "Timeout occurred in connect": "Der Test hat zu lange gedauert und wurde abgebrochen",
    "permission denied": "MySpeed hat keine Berechtigung, diesen Test zu starten",
    "Resource temporarily unavailable": "Der Test konnte nicht durchgeführt werden, da die Ressource vorübergehend nicht verfügbar ist",
    "No route to host": "Der Test konnte nicht durchgeführt werden, da keine Route zum Host existiert",
    "Connection refused": "Der Test konnte nicht durchgeführt werden, da die Verbindung abgelehnt wurde",
    "timed out": "Der Test konnte nicht durchgeführt werden, da die Verbindung zu lange gedauert hat",
    "Could not retrieve or read configuration": "Die Konfigurationsdatei konnte nicht geladen werden",
}

function SpeedtestComponent(props) {

    const [setDialog] = useContext(DialogContext);
    const updateTests = useContext(SpeedtestContext)[1];

    let passwordHeaders = localStorage.getItem("password") ? {password: localStorage.getItem("password")} : {}

    let errorMessage = "Unbekannter Fehler: " + props.error;

    if (props.error) {
        for (let errorsKey in errors)
            if (props.error.includes(errorsKey)) errorMessage = errors[errorsKey];
    }

    return (
        <div>
            <div className="speedtest">
                <div className="date">
                    <div className="tooltip-element">
                        <FontAwesomeIcon icon={props.error ? faInfo : faClockRotateLeft}
                                         className={"container-icon help-icon icon-" + (props.error ? "error" : "blue")}
                                         onClick={props.error ? () => setDialog({
                                             title: "Test fehlgeschlagen",
                                             description: errorMessage + ". Bitte überprüfe weitestgehend, ob das öfters passiert.",
                                             buttonText: "Okay",
                                             unsetButton: true,
                                             unsetButtonText: "Test löschen",
                                             onClear: () => fetch("/api/speedtests/"+props.id, {headers: passwordHeaders, method: "DELETE"})
                                                 .then(updateTests)
                                         }) : () => setDialog({
                                             title: "Testergebnis",
                                             description: <>Dieser Test erreichte eine maximale Downloadgeschwindigkeit von <span className="dialog-value">{props.down} Mbit/s </span>
                                                    und eine maximale Uploadgeschwindigkeit von <span className="dialog-value">{props.up} Mbit/s</span>. Er wurde <span className="dialog-value">{props.type === "custom"
                                                     ? "von dir" : "automatisch"}</span> angelegt und hat <span className="dialog-value">{props.duration} Sekunden</span> gedauert.</>,
                                             buttonText: "Okay",
                                             unsetButton: true,
                                             unsetButtonText: "Test löschen",
                                             onClear: () => fetch("/api/speedtests/"+props.id, {headers: passwordHeaders, method: "DELETE"})
                                                 .then(updateTests)
                                         })} />
                        <span className="tooltip">{props.type === "custom" ? "Benutzerdefiniert" :"Automatisiert"}</span>
                    </div>

                    <h2 className="date-text">Um {props.time}</h2>
                </div>
                <div className="speedtest-row">
                    <FontAwesomeIcon icon={props.error ? faClose : faPingPongPaddleBall}
                                     className={"speedtest-icon icon-" + props.pingLevel}/>
                    <h2 className="speedtest-text">{props.error ? "" : props.ping}</h2>
                </div>
                <div className="speedtest-row">
                    <FontAwesomeIcon icon={props.error ? faClose : faArrowDown}
                                     className={"speedtest-icon icon-" + props.downLevel}/>
                    <h2 className="speedtest-text">{props.error ? "" : props.down}</h2>
                </div>
                <div className="speedtest-row">
                    <FontAwesomeIcon icon={props.error ? faClose : faArrowUp}
                                     className={"speedtest-icon icon-" + props.upLevel}/>
                    <h2 className="speedtest-text">{props.error ? "" : props.up}</h2>
                </div>
            </div>
        </div>
    );
}

export default SpeedtestComponent;