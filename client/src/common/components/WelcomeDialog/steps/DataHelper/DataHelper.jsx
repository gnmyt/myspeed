import "./styles.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown, faArrowUp, faTableTennis} from "@fortawesome/free-solid-svg-icons";
import {t} from "i18next";

export const DataHelper = ({setDownload, download, ping, setPing, upload, setUpload}) => {
    return (
        <div className="data-helper">
            <h2>{t("welcome.data_title")}</h2>
            <p>{t("welcome.data_subtext")}</p>

            <div className="speeds">
                <div className="speed">
                    <div className="speed-header">
                        <FontAwesomeIcon icon={faTableTennis}/>
                        <div className="speed-text">
                            <h2>{t("latest.ping")}</h2>
                            <p>{t("welcome.ms")}</p>
                        </div>
                    </div>
                    <input type="number" placeholder={t("latest.ping")} className="dialog-input"
                            value={ping} onChange={(e) => setPing(e.target.value)}/>
                </div>
                <div className="speed">
                    <div className="speed-header">
                        <FontAwesomeIcon icon={faArrowDown}/>
                        <div className="speed-text">
                            <h2>{t("latest.down")}</h2>
                            <p>{t("welcome.mbps")}</p>
                        </div>
                    </div>
                    <input type="number" placeholder={t("latest.down")}  className="dialog-input"
                            value={download} onChange={(e) => setDownload(e.target.value)}/>
                </div>
                <div className="speed">
                    <div className="speed-header">
                        <FontAwesomeIcon icon={faArrowUp}/>
                        <div className="speed-text">
                            <h2>{t("latest.up")}</h2>
                            <p>{t("welcome.mbps")}</p>
                        </div>
                    </div>
                    <input type="number" placeholder={t("latest.up")} className="dialog-input"
                            value={upload} onChange={(e) => setUpload(e.target.value)}/>
                </div>
            </div>
        </div>
    )
}