import {DialogContext, DialogProvider} from "@/common/contexts/Dialog";
import "./styles.sass";
import React, {useContext, useEffect, useState} from "react";
import {t} from "i18next";
import {faClose} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {jsonRequest} from "@/common/utils/RequestUtil";
import IntegrationItem from "@/common/components/IntegrationDialog/components/IntegrationItem";
import {v4 as uuid} from 'uuid';
import AvailableIntegrations from "./components/AvailableIntegrations";
import IntegrationAddButton from "@/common/components/IntegrationDialog/components/IntegrationAddButton";
import NoIntegrationsTab from "@/common/components/IntegrationDialog/components/NoIntegrationsTab";

export const Dialog = ({integrations, active, setActive}) => {
    const close = useContext(DialogContext);
    const [currentTab, setCurrentTab] = useState(integrations[Object.keys(integrations)[0]].name);

    const addIntegration = () => setActive([...active, {uuid: uuid(), name: currentTab,
        integration: integrations[currentTab], data: {}, open: true}]);

    const deleteIntegration = (uuid) => setActive(active.filter((item) => item.uuid !== uuid));

    return (
        <>
            <div className="dialog-header">
                <h4 className="dialog-text">{t("dropdown.integrations")}</h4>
                <FontAwesomeIcon icon={faClose} className="dialog-text dialog-icon" onClick={() => close()}/>
            </div>
            <div className="integration-dialog">
                <AvailableIntegrations integrations={integrations} currentTab={currentTab}
                                       setCurrentTab={setCurrentTab}/>

                <div className="integrations-tab">
                    {active.map((item) => (item.name !== currentTab ? undefined :
                        <IntegrationItem integration={integrations[currentTab]}
                                         remove={() => deleteIntegration(item.uuid)}
                                         data={item} key={item.uuid} isOpen={item.open} />))}

                    {active.filter(item => item.name === currentTab).length === 0
                        && <NoIntegrationsTab onClick={addIntegration} integration={integrations[currentTab]}/>}

                    {active.filter(item => item.name === currentTab).length > 0
                        && <IntegrationAddButton onClick={addIntegration}/>}
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
            .then(data => setActiveData(data.map(item => ({...item, uuid: uuid()}))))
            .catch(err => console.log(err));
    }, []);

    return (
        <>
            <DialogProvider close={props.onClose}>
                {!integrationData || !activeData && <div className="lds-ellipsis"><div/><div/><div/><div/></div>}
                {integrationData && activeData && <Dialog integrations={integrationData} active={activeData} setActive={setActiveData}/>}
            </DialogProvider>
        </>
    )
}