import StatisticContainer from "@/pages/Statistics/components/StatisticContainer";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGauge, faMinusCircle, faPlusCircle} from "@fortawesome/free-solid-svg-icons";
import {t} from "i18next";
import "./styles.sass";

export const AverageChart = (props) => {

    return (
        <StatisticContainer title={props.title} size="small" center={true}>
            <div className="value-container">
                <div className="value-item">
                    <div className="value-info">
                        <h2>{t("statistics.values.min")}</h2>
                        <p>{props.data.min} {t("latest.speed_unit")}</p>
                    </div>
                    <FontAwesomeIcon icon={faMinusCircle}/>
                </div>
                <div className="value-item">
                    <div className="value-info">
                        <h2>{t("statistics.values.max")}</h2>
                        <p>{props.data.max} {t("latest.speed_unit")}</p>
                    </div>
                    <FontAwesomeIcon icon={faPlusCircle}/>
                </div>
                <div className="value-item">
                    <div className="value-info">
                        <h2>{t("statistics.values.avg")}</h2>
                        <p>{props.data.avg} {t("latest.speed_unit")}</p>
                    </div>
                    <FontAwesomeIcon icon={faGauge}/>
                </div>
            </div>
        </StatisticContainer>
    );

}