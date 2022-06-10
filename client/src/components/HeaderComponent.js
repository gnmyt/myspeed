import "../style/Header.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleExclamation, faGaugeHigh, faGear} from "@fortawesome/free-solid-svg-icons";
import DropdownComponent, {toggleDropdown} from "./DropdownComponent";
import {useContext, useEffect, useState} from "react";
import { DialogContext } from "../context/DialogContext";


function HeaderComponent() {

    const [setDialog] = useContext(DialogContext);
    const [icon, setIcon] = useState(faGear);
    const [updateAvailable, setUpdateAvailable] = useState("");

    let headers = localStorage.getItem("password") ? {password: localStorage.getItem("password")} : {}
    headers['content-type'] = 'application/json'
    
    function switchDropdown() {
        toggleDropdown(setIcon);
    }

    const startSpeedtest = async () => {
        setDialog({speedtest: true, promise: fetch("/api/speedtests/run", {headers: headers, method: "POST"})});
    }

    function checkUpdate() {
        fetch("/api/info/version", {headers: headers})
            .then(res => res.json())
            .then(version => {
                if (version.remote.localeCompare(version.local, undefined, 
                    {numeric: true, sensitivity: 'base'}) === 1) {
                        setUpdateAvailable(version.remote);
                }
            });
    }

    useEffect(() => {
        checkUpdate();
    });

    return (
        <header>
            <div className="header-main">
                <h2>Netzwerkanalyse</h2>
                <div className="header-right">
                    {updateAvailable ? <FontAwesomeIcon icon={faCircleExclamation} className="header-icon icon-orange" 
                    onClick={() => setDialog({title: "Update verfügbar", buttonText: "Okay", description: <>Ein Update auf die Version {updateAvailable} ist verfügbar.
                        Sieh dir <a target="_blank" href="https://github.com/gnmyt/myspeed/releases/latest" rel="noreferrer">die Änderungen an</a> und <a target="_blank" 
                        href="https://github.com/gnmyt/myspeed/wiki/Einrichtung-Linux" rel="noreferrer">lade dir das Update herunter</a>.</>})} /> 
                        : <></>}
                    <FontAwesomeIcon icon={faGaugeHigh} className="header-icon" onClick={startSpeedtest} />
                    <FontAwesomeIcon icon={icon} className="header-icon" onClick={switchDropdown} />
                </div>
            </div>
            <DropdownComponent/>
        </header>
    )

}

export default HeaderComponent;