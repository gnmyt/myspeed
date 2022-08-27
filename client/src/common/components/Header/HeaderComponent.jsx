import "./styles.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleExclamation, faGaugeHigh, faGear} from "@fortawesome/free-solid-svg-icons";
import {useContext, useEffect, useState} from "react";
import DropdownComponent, {toggleDropdown} from "../Dropdown/DropdownComponent";
import {DialogContext} from "@/common/contexts/Dialog";
import {StatusContext} from "@/common/contexts/Status";
import {SpeedtestContext} from "@/common/contexts/Speedtests";


function HeaderComponent() {

    const [setDialog] = useContext(DialogContext);
    const [icon, setIcon] = useState(faGear);
    const [status, updateStatus] = useContext(StatusContext);
    const updateTests = useContext(SpeedtestContext)[1];
    const [updateAvailable, setUpdateAvailable] = useState("");

    const headers = localStorage.getItem("password") ? {password: localStorage.getItem("password")} : {}
    headers['content-type'] = 'application/json'

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

        fetch("/api/speedtests/run", {headers, method: "POST"}).then(() => {
            updateTests();
            updateStatus();
            setDialog();
        });
    }

    useEffect(() => {
        fetch("/api/info/version", {headers})
            .then(res => res.json())
            .then(version => {
                if (version.remote.localeCompare(version.local, undefined,
                    {numeric: true, sensitivity: 'base'}) === 1)
                    setUpdateAvailable(version.remote);
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                                                  description: <>Ein Update auf die Version {updateAvailable} ist
                                                      verfügbar. Sieh dir <a target="_blank"
                                                                             href="https://github.com/gnmyt/myspeed/releases/latest"
                                                                             rel="noreferrer">die Änderungen
                                                          an</a> und <a target="_blank"
                                                                        href="https://myspeed.gnmyt.dev/setup/linux/"
                                                                        rel="noreferrer">lade dir das Update
                                                          herunter</a>.</>
                                              })}/></div>
                        : <></>}
                    <div className="tooltip-element tooltip-bottom">
                        <FontAwesomeIcon icon={faGaugeHigh}
                                         className={"header-icon " + (status.running ? "icon-red" : "")}
                                         onClick={startSpeedtest}/>
                        <span className="tooltip">Speedtest starten</span>
                    </div>

                    <div className="tooltip-element tooltip-bottom">
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