import "./styles.sass";
import React, {useContext, useEffect, useState} from "react";
import {DialogContext, DialogProvider} from "@/common/contexts/Dialog";
import {t} from "i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClose, faDatabase, faGauge, faScrewdriverWrench} from "@fortawesome/free-solid-svg-icons";
import Speedtests from "./tabs/Speedtests";
import Configuration from "./tabs/Configuration";
import {jsonRequest} from "@/common/utils/RequestUtil";

const Dialog = () => {
    const close = useContext(DialogContext);
    const [storageSize, setStorageSize] = useState({size: 0, testCount: 0});

    const [currentTab, setCurrentTab] = useState(1);

    useEffect(() => {
        jsonRequest("/storage").then((res) => {
            setStorageSize(res);
        });
    }, []);

    return (
        <>
            <div className="dialog-header">
                <h4 className="dialog-text">{t("dropdown.storage")}</h4>
                <FontAwesomeIcon icon={faClose} className="dialog-text dialog-icon" onClick={() => close()}/>
            </div>
            <div className="storage-dialog">
                <div className="storage-options">
                    <div className="storage-top">
                        <div className={"storage-tab" + (1 === currentTab ? " storage-item-active" : "")}
                             onClick={() => setCurrentTab(1)}>
                            <FontAwesomeIcon icon={faGauge}/>
                            <p>{t("storage.speedtests")}</p>
                        </div>
                        <div className={"storage-tab" + (2 === currentTab ? " storage-item-active" : "")}
                             onClick={() => setCurrentTab(2)}>
                            <FontAwesomeIcon icon={faScrewdriverWrench}/>
                            <p>{t("storage.configuration")}</p>
                        </div>

                    </div>
                    <div className="storage-bottom">
                        <div className="storage-tab reset-cursor">
                            <FontAwesomeIcon icon={faDatabase}/>
                            <p>{Math.round(storageSize.size / 1024)} KB</p>
                        </div>
                    </div>
                </div>

                <div className="storage-manager">
                    {currentTab === 1 && <Speedtests tests={storageSize.testCount}/>}
                    {currentTab === 2 && <Configuration/>}
                </div>


            </div>
        </>
    );
}

export const StorageDialog = ({onClose}) => {
    return (
        <DialogProvider close={onClose}>
            <Dialog/>
        </DialogProvider>
    )
}