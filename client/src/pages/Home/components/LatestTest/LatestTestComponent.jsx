import {useContext, useEffect, useState} from "react";
import {faArrowDown, faArrowUp, faClockRotateLeft, faPingPongPaddleBall} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {generateRelativeTime} from "./utils";
import {StatusContext} from "@/common/contexts/Status";
import {DialogContext} from "@/common/contexts/Dialog";
import {SpeedtestContext} from "@/common/contexts/Speedtests";
import {ConfigContext} from "@/common/contexts/Config";
import "./styles.sass";
import {getIconBySpeed} from "@/common/utils/TestUtil";
import {downloadInfo, latestTestInfo, pingInfo, uploadInfo} from "@/pages/Home/components/LatestTest/utils/dialogs";
import {t} from "i18next";

function LatestTestComponent() {
    const status = useContext(StatusContext)[0];
    const [latest, setLatest] = useState({});
    const [latestTestTime, setLatestTestTime] = useState("-");
    const [setDialog] = useContext(DialogContext);
    const [speedtests] = useContext(SpeedtestContext);
    const config = useContext(ConfigContext)[0];

    useEffect(() => {
        setLatest(Object.keys(speedtests).length !== 0 ? speedtests[0] : {ping: "N/A", download: "N/A", upload: "N/A"});
    }, [speedtests]);

    useEffect(() => {
        if (latest) setLatestTestTime(generateRelativeTime(latest.created));
        const interval = setInterval(() => setLatestTestTime(generateRelativeTime(latest ? latest.created : 0)), 1000);
        return () => clearInterval(interval);
    }, [latest]);

    if (Object.entries(config).length === 0) return (<></>);

    return (
        <div className={"analyse-area " + (status.paused ? "tests-paused" : "pulse")}>
            {/* Ping */}
            <div className="inner-container">
                <div className="container-header">
                    <FontAwesomeIcon onClick={() => setDialog(pingInfo())} icon={faPingPongPaddleBall}
                                     className={"container-icon help-icon icon-" + getIconBySpeed(latest.ping, config.ping, false)}/>
                    <h2 className="container-text">{t("latest.ping")}<span className="container-subtext">{t("latest.ping_unit")}</span></h2>
                </div>
                <div className="container-main">
                    <h2>{latest.ping === -1 ? "-" : latest.ping}</h2>
                </div>
            </div>

            {/* Download */}
            <div className="inner-container">
                <div className="container-header">
                    <FontAwesomeIcon onClick={() => setDialog(downloadInfo())} icon={faArrowDown}
                                     className={"container-icon help-icon icon-" + getIconBySpeed(latest.download, config.download, true)}/>
                    <h2 className="container-text">{t("latest.down")}<span className="container-subtext">{t("latest.speed_unit")}</span></h2>
                </div>
                <div className="container-main">
                    <h2>{latest.download === -1 ? "-" : latest.download}</h2>
                </div>
            </div>

            <div className="mobile-break"></div>

            {/* Upload */}
            <div className="inner-container">
                <div className="container-header">
                    <FontAwesomeIcon onClick={() => setDialog(uploadInfo())} icon={faArrowUp}
                                     className={"container-icon help-icon icon-" + getIconBySpeed(latest.upload, config.upload, true)}/>
                    <h2 className="container-text">{t("latest.up")}<span className="container-subtext">{t("latest.speed_unit")}</span></h2>
                </div>
                <div className="container-main">
                    <h2>{latest.upload === -1 ? "-" : latest.upload}</h2>
                </div>
            </div>

            {/* Latest update */}
            <div className="inner-container">
                <div className="container-header">
                    <FontAwesomeIcon onClick={() => setDialog(latestTestInfo(latest))} icon={faClockRotateLeft}
                                     className="container-icon icon-blue help-icon"/>
                    <h2 className="container-text">{t("latest.latest")}<span className="container-subtext">{t("latest.before")}</span></h2>
                </div>
                <div className="container-main">
                    <h2>{latestTestTime}</h2>
                </div>
            </div>
        </div>
    )
}

export default LatestTestComponent;