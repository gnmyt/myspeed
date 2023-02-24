import StatisticContainer from "@/pages/Statistics/components/StatisticContainer";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown, faArrowUp, faPingPongPaddleBall} from "@fortawesome/free-solid-svg-icons";
import "./styles.sass";
import {getIconBySpeed} from "@/common/utils/TestUtil";
import {useContext} from "react";
import {ConfigContext} from "@/common/contexts/Config";
import {t} from "i18next";

export const LatestTestChart = (props) => {

    const [config] = useContext(ConfigContext);

    if (!props.test) return <></>;
    if (config === null) return <></>;

    return (
        <StatisticContainer title={t("latest.latest")}>
            <div className="info-container">
                <div className="test-container">
                    <div className="test-info">
                        <h2>{t("latest.ping")}</h2>
                        <p className={"icon-" + getIconBySpeed(props.test.ping, config.ping, false)}>
                            {(props.test.ping === -1 ? "N/A" : props.test.ping) + " " + t("latest.ping_unit")}</p>
                    </div>
                    <FontAwesomeIcon icon={faPingPongPaddleBall}
                                     className={"icon-" + getIconBySpeed(props.test.ping, config.ping, false)}/>
                </div>
                <div className="test-container">
                    <div className="test-info">
                        <h2>{t("latest.up")}</h2>
                        <p className={"icon-" + getIconBySpeed(props.test.upload, config.upload, true)}>
                            {(props.test.upload === -1 ? "N/A" : props.test.upload) + " " + t("latest.speed_unit")}</p>
                    </div>
                    <FontAwesomeIcon icon={faArrowUp}
                                     className={"icon-" + getIconBySpeed(props.test.upload, config.upload, true)}/>
                </div>
                <div className="test-container">
                    <div className="test-info">
                        <h2>{t("latest.down")}</h2>
                        <p className={"icon-" + getIconBySpeed(props.test.download, config.download, true)}>
                            {(props.test.download === -1 ? "N/A" : props.test.download) + " " + t("latest.speed_unit")}</p>
                    </div>
                    <FontAwesomeIcon icon={faArrowDown}
                                     className={"icon-" + getIconBySpeed(props.test.download, config.download, true)}/>
                </div>
            </div>
        </StatisticContainer>
    );

}