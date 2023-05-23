import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAdd} from "@fortawesome/free-solid-svg-icons";
import {t} from "i18next";
import React from "react";
import "./styles.sass";

export const IntegrationAddButton = ({onClick}) => (
    <div className="add-container">
        <div className="add-integration" onClick={onClick}>
            <FontAwesomeIcon icon={faAdd}/>
            <p>{t("integrations.create")}</p>
        </div>
    </div>
)