import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Trans} from "react-i18next";
import React from "react";
import "./styles.sass";

export const NoIntegrationsTab = ({onClick, integration}) => (
    <div className="no-integrations">
        <FontAwesomeIcon icon={integration.icon}/>
        <p className="dialog-text"><Trans
            components={{Bold: <span className="integration-add" onClick={onClick}/>}}>
            integrations.none_active</Trans></p>
    </div>
)