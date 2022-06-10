import "../style/Header.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGaugeHigh, faGear} from "@fortawesome/free-solid-svg-icons";
import DropdownComponent, {toggleDropdown} from "./DropdownComponent";
import {useContext, useState} from "react";
import { DialogContext } from "../context/DialogContext";


function HeaderComponent() {

    const [setDialog] = useContext(DialogContext);
    const [icon, setIcon] = useState(faGear);

    let headers = localStorage.getItem("password") ? {password: localStorage.getItem("password")} : {}
    headers['content-type'] = 'application/json'
    
    function switchDropdown() {
        toggleDropdown(setIcon);
    }

    const startSpeedtest = async () => {
        setDialog({speedtest: true, promise: fetch("/api/speedtests/run", {headers: headers, method: "POST"})});
    }

    return (
        <header>
            <div className="header-main">
                <h2>Netzwerkanalyse</h2>
                <div className="header-right">
                    <FontAwesomeIcon icon={faGaugeHigh} className="header-icon" onClick={startSpeedtest} />
                    <FontAwesomeIcon icon={icon} className="header-icon" onClick={switchDropdown} />
                </div>
            </div>
            <DropdownComponent/>
        </header>
    )

}

export default HeaderComponent;