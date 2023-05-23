import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {t} from "i18next";
import "./styles.sass";

export const AvailableIntegrations = ({integrations, currentTab, setCurrentTab}) => (
    <div className="available-integrations">
        {Object.keys(integrations).map((key) => <div
            className={"integration-tab" + (key === currentTab ? " integration-active" : "")} key={key}
            onClick={() => setCurrentTab(key)}>

            <FontAwesomeIcon icon={integrations[key].icon} className="integration-icon"/>
            <p className="integration-text">{t(`integrations.${key}.title`)}</p>
        </div>)}
    </div>
)