import {DialogContext, DialogProvider} from "@/common/contexts/Dialog";
import "./styles.sass";
import React, {useContext, useEffect, useState} from "react";
import {t} from "i18next";
import {faAdd, faClose} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {jsonRequest} from "@/common/utils/RequestUtil";
import IntegrationItem from "@/common/components/IntegrationDialog/components/IntegrationItem";
import {Trans} from "react-i18next";
import { v4 as uuid } from 'uuid';


export const Dialog = ({integrations, activeData}) => {
    const close = useContext(DialogContext);
    const [currentTab, setCurrentTab] = useState(integrations[Object.keys(integrations)[0]].name);

    const [active, setActive] = useState(activeData.map(item => ({...item, uuid: uuid()})));

    const addIntegration = () =>
        setActive([...active, {uuid: uuid(), name: currentTab, integration: integrations[currentTab], data: {}, open:true}]);

    const deleteIntegration = (uuid) => setActive(active.filter((item) => item.uuid !== uuid));

    return (
        <>
            <div className="dialog-header">
                <h4 className="dialog-text">{t("dropdown.integrations")}</h4>
                <FontAwesomeIcon icon={faClose} className="dialog-text dialog-icon" onClick={() => close()}/>
            </div>
            <div className="integration-dialog">
                <div className="available-integrations">
                    {Object.keys(integrations).map((key, index) => <div
                        className={"integration-tab" + (key === currentTab ? " integration-active" : "")}
                        key={key} onClick={() => setCurrentTab(key)}>

                        <FontAwesomeIcon icon={integrations[key].icon} className="integration-icon"/>
                        <p className="integration-text">{t(`integrations.${key}.title`)}</p>
                    </div>)}
                </div>

                <div className="integrations-tab">
                    {active.map((item) => {
                        if (item.name === currentTab)
                            return (<IntegrationItem integration={integrations[currentTab]} remove={() => deleteIntegration(item.uuid)}
                                                     data={item} key={item.uuid} isOpen={item.open}/>);
                    })}
                    {active.filter(item => item.name === currentTab).length === 0 && <div className="no-integrations">
                        <FontAwesomeIcon icon={integrations[currentTab].icon} />
                        <p className="dialog-text"><Trans components={{Bold: <span className="integration-add" onClick={addIntegration} />}}>
                            integrations.none_active</Trans> </p>
                    </div>}
                    {active.filter(item => item.name === currentTab).length > 0 && <div className="add-container">

                    <div className="add-integration" onClick={addIntegration}>
                        <FontAwesomeIcon icon={faAdd} />
                        <p>Hinzufügen</p>
                    </div></div>}
                </div>
            </div>
        </>
    );
}

export const IntegrationDialog = (props) => {
    const [integrationData, setIntegrationData] = useState(undefined);
    const [activeData, setActiveData] = useState(undefined);

    useEffect(() => {
        jsonRequest("/integrations")
            .then(data => setIntegrationData(data))
            .catch(err => console.log(err));

        jsonRequest("/integrations/active")
            .then(data => setActiveData(data))
            .catch(err => console.log(err));
    }, []);

    return (
        <>
            <DialogProvider close={props.onClose}>
                {integrationData && activeData && <Dialog integrations={integrationData} activeData={activeData}/>}
            </DialogProvider>
        </>
    )
}