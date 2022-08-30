import "./styles.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleExclamation, faGaugeHigh, faGear} from "@fortawesome/free-solid-svg-icons";
import {useContext, useEffect, useState} from "react";
import DropdownComponent, {toggleDropdown} from "../Dropdown/DropdownComponent";
import {DialogContext} from "@/common/contexts/Dialog";
import {StatusContext} from "@/common/contexts/Status";
import {SpeedtestContext} from "@/common/contexts/Speedtests";
import {jsonRequest, postRequest} from "@/common/utils/RequestUtil";
import {updateInfo} from "@/common/components/Header/utils/infos";

function HeaderComponent() {
    const [setDialog] = useContext(DialogContext);
    const [icon, setIcon] = useState(faGear);
    const [status, updateStatus] = useContext(StatusContext);
    const updateTests = useContext(SpeedtestContext)[1];
    const [updateAvailable, setUpdateAvailable] = useState("");

    function switchDropdown() {
        toggleDropdown(setIcon);
    }

    const startSpeedtest = async () => {
        await updateStatus();
        if (status.paused) return setDialog({
            title: "Fehlgeschlagen",
            description: "Speedtests sind aktuell pausiert. Bitte setze sie fort, wenn du einen machen möchtest.",
            buttonText: "Okay"
        });

        if (status.running) return setDialog({
            title: "Fehlgeschlagen",
            description: "Es läuft bereits ein Speedtest. Bitte gedulde dich ein wenig, bis dieser fertig ist.",
            buttonText: "Okay"
        });

        setDialog({speedtest: true});

        postRequest("/speedtests/run").then(updateTests).then(updateStatus).then(setDialog);
    }

    useEffect(() => {
        async function updateVersion() {
            const version = await jsonRequest("/info/version");

            if (version.remote.localeCompare(version.local, undefined, {numeric: true, sensitivity: 'base'}) === 1)
                setUpdateAvailable(version.remote);
        }

        updateVersion();
    }, []);

    return (
        <header>
            <div className="header-main">
                <h2>Netzwerkanalyse</h2>
                <div className="header-right">
                    {updateAvailable ?
                        <div><FontAwesomeIcon icon={faCircleExclamation} className="header-icon icon-orange"
                                              onClick={() => setDialog({
                                                  title: "Update verfügbar",
                                                  buttonText: "Okay",
                                                  description: updateInfo(updateAvailable)
                                              })}/></div> : <></>}

                    <div className="tooltip-element tooltip-bottom">
                        <FontAwesomeIcon icon={faGaugeHigh}
                                         className={"header-icon " + (status.running || status.paused ? "icon-red" : "")}
                                         onClick={startSpeedtest}/>
                        <span className="tooltip">Speedtest starten</span>
                    </div>

                    <div className="tooltip-element tooltip-bottom" id="open-header">
                        <FontAwesomeIcon icon={icon} className="header-icon" onClick={switchDropdown}/>
                        <span className="tooltip">Einstellungen</span>
                    </div>
                </div>
            </div>
            <DropdownComponent/>
        </header>
    )
}

export default HeaderComponent;