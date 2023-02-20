import {DialogContext, DialogProvider} from "@/common/contexts/Dialog";
import {InputDialogContext} from "@/common/contexts/InputDialog";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClose} from "@fortawesome/free-solid-svg-icons";
import React, {useContext, useState} from "react";
import {ViewContext} from "@/common/contexts/View";
import ListImage from "./images/list.png";
import StatisticImage from "./images/statistic.png";
import {t} from "i18next";
import "./styles.sass";

export const Dialog = () => {
    const close = useContext(DialogContext);
    const [setDialog] = useContext(InputDialogContext);
    const [view, setView] = useContext(ViewContext);
    const [selected, setSelected] = useState(view);

    const submitForm = () => {
        close();
        setView(selected);
        setDialog({title: "MySpeed", description: t('dropdown.changes_applied'), buttonText: t('dialog.okay')});
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
                    <p>{t("test.views.list")}</p>
                </div>
                <div className="chooser-item" onClick={() => setSelected(1)}>
                    <img src={StatisticImage} alt={t("test.views.statistic")}
                         className={"dialog-thumbnail" + (selected === 1 ? " thumbnail-selected" : "")}/>
                    <p>{t("test.views.statistic")}</p>
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