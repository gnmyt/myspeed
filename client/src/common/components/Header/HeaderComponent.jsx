import "./styles.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleArrowUp, faGaugeHigh, faGear} from "@fortawesome/free-solid-svg-icons";
import {useContext, useEffect, useState} from "react";
import DropdownComponent, {toggleDropdown} from "../Dropdown/DropdownComponent";
import {DialogContext} from "@/common/contexts/Dialog";
import {StatusContext} from "@/common/contexts/Status";
import {SpeedtestContext} from "@/common/contexts/Speedtests";
import {jsonRequest, postRequest} from "@/common/utils/RequestUtil";
import {updateInfo} from "@/common/components/Header/utils/infos";
import {t} from "i18next";

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
            title: t("failed"),
            description: t("header.paused"),
            buttonText: t("dialog.okay")
        });

        if (status.running) return setDialog({
            title: t("failed"),
            description: t("header.running"),
            buttonText: t("dialog.okay")
        });

        setDialog({speedtest: true, disableCloseButton: true});

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
                <h2>{t("header.title")}</h2>
                <div className="header-right">
                    {updateAvailable ?
                        <div><FontAwesomeIcon icon={faCircleArrowUp} className="header-icon icon-orange update-icon"
                                              onClick={() => setDialog({
                                                  title: t("header.new_update"),
                                                  buttonText: t("dialog.okay"),
                                                  description: updateInfo(updateAvailable)
                                              })}/></div> : <></>}

                    {!status.paused ? <div className="tooltip-element tooltip-bottom">
                        <FontAwesomeIcon icon={faGaugeHigh}
                                         className={"header-icon " + (status.running ? "test-running" : "")}
                                         onClick={startSpeedtest}/>
                        <span className="tooltip">{t("header." + (status.running ? "running_tooltip" : "start_tooltip"))}</span>
                    </div> : <></>}


                    <div className="tooltip-element tooltip-bottom" id="open-header">
                        <FontAwesomeIcon icon={icon} className="header-icon" onClick={switchDropdown}/>
                        <span className="tooltip">{t("dropdown.settings")}</span>
                    </div>
                </div>
            </div>
            <DropdownComponent/>
        </header>
    )
}

export default HeaderComponent;