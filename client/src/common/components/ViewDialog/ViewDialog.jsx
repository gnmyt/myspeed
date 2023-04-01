import {DialogContext, DialogProvider} from "@/common/contexts/Dialog";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClose, faWindowRestore} from "@fortawesome/free-solid-svg-icons";
import React, {useContext, useState} from "react";
import {ViewContext} from "@/common/contexts/View";
import ListImage from "./images/list.png";
import StatisticImage from "./images/statistic.png";
import NodeImage from "./images/node.png";
import {t} from "i18next";
import "./styles.sass";
import {ToastNotificationContext} from "@/common/contexts/ToastNotification";

export const Dialog = () => {
    const close = useContext(DialogContext);
    const updateToast = useContext(ToastNotificationContext);
    const [view, setView] = useContext(ViewContext);
    const [selected, setSelected] = useState(view);

    const submitForm = () => {
        close();
        setView(selected);
        updateToast(t('dropdown.view_changed'), "green", faWindowRestore);
    }

    return (
        <>
            <div className="dialog-header">
                <h4 className="dialog-text">{t("update.view_title")}</h4>
                <FontAwesomeIcon icon={faClose} className="dialog-text dialog-icon" onClick={() => close()}/>
            </div>
            <div className="chooser-dialog">
                <div className="chooser-item" onClick={() => setSelected(0)}>
                    <img src={ListImage} alt={t("test.views.list")}
                         className={"dialog-thumbnail" + (selected === 0 ? " thumbnail-selected" : "")}/>
                    <p className={selected === 0 ? "text-selected" : ""}>{t("test.views.list")}</p>
                </div>
                <div className="chooser-item" onClick={() => setSelected(1)}>
                    <img src={StatisticImage} alt={t("test.views.statistic")}
                         className={"dialog-thumbnail" + (selected === 1 ? " thumbnail-selected" : "")}/>
                    <p className={selected === 1 ? "text-selected" : ""}>{t("test.views.statistic")}</p>
                </div>
                <div className="chooser-item" onClick={() => setSelected(2)}>
                    <img src={NodeImage} alt={t("test.views.node")}
                            className={"dialog-thumbnail" + (selected === 2 ? " thumbnail-selected" : "")}/>
                    <p className={selected === 2 ? "text-selected" : ""}>{t("test.views.node")}</p>
                </div>
            </div>
            <div className="dialog-buttons">
                <button className="dialog-btn" onClick={submitForm}>{t("dialog.update")}</button>
            </div>
        </>
    );

}

export const ViewDialog = (props) => {
    return (
        <DialogProvider close={props.onClose}>
            <Dialog/>
        </DialogProvider>
    );
}