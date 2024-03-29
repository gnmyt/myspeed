import React, {createContext, useContext, useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClose} from "@fortawesome/free-solid-svg-icons";
import {t} from "i18next";
import {DialogContext, DialogProvider} from "@/common/contexts/Dialog";
import "./styles.sass";

export const InputDialogContext = createContext({});

const DialogArea = ({dialog}) => {
    const close = useContext(DialogContext);
    const [value, setValue] = useState("");
    const [error, setError] = useState(false);

    useEffect(() => {
        if (dialog.value) setValue(dialog.value);
    }, [dialog.value]);

    useEffect(() => {
        document.onkeyup = e => {
            if (e.key === "Enter") {
                e.preventDefault();
                submit();
            }
            if (e.key === "Escape" && !dialog.disableCloseButton) {
                e.preventDefault();
                closeDialog();
            }
        }

        return () => {
            document.onkeyup = null;
        }
    });

    function updateValue(e) {
        if (dialog.updateDescription) dialog.description = dialog.updateDescription(e.target.value);
        setValue(e.target.value);
    }

    function closeDialog() {
        close();
        if (dialog.onClose) dialog.onClose();
    }

    function submit() {
        if (!dialog.description && !value) {
            setError(true);
            return;
        }
        close(true);
        if (dialog.onSuccess) dialog.onSuccess(value);
    }

    function clear() {
        close();
        if (dialog.onClear) dialog.onClear();
    }

    return (
        <>
            <div className="dialog-header">
                <h4 className="dialog-text">{dialog.title}</h4>
                {!dialog.disableCloseButton ?
                    <FontAwesomeIcon icon={faClose} className="dialog-text dialog-icon" onClick={closeDialog}/> : <></>}
            </div>
            <div className="dialog-main">
                {dialog.description ? <h3 className="dialog-description">{dialog.description}</h3> : ""}
                {dialog.placeholder ? <input className={"dialog-input" + (error ? " input-error" : "")}
                                             type={dialog.type ? dialog.type : "text"}
                                             placeholder={dialog.placeholder} value={value}
                                             onChange={updateValue}/> : ""}
                {dialog.select ? <select value={value} onChange={updateValue} className="dialog-input">
                    {Object.keys(dialog.selectOptions).map(key => <option key={key}
                                                                          value={key}>{dialog.selectOptions[key]}</option>)}
                </select> : ""}
            </div>
            <div className="dialog-buttons">
                {dialog.unsetButton ? <button className="dialog-btn dialog-secondary"
                                              onClick={clear}>{dialog.unsetButton || t("dialog.unset")}</button> : ""}
                <button className={"dialog-btn"+(dialog.mainRed ? " dialog-secondary" : "")} onClick={submit}>{dialog.buttonText || t("dialog.update")}</button>
            </div>
        </>
    )
}

export const InputDialogProvider = (props) => {
    const [dialog, setDialog] = useState();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogList, setDialogList] = useState([]);

    const updateDialog = (newDialog) => newDialog ? setDialogList([...dialogList, newDialog]) : "";

    useEffect(() => {
        if (dialogList.length === 0) return;
        if ((!isDialogOpen && dialogList[0]) || dialogList[0].replace) {
            setDialog(dialogList[0]);
            setDialogList(dialogList.slice(1));
            setIsDialogOpen(true);
        }
    }, [isDialogOpen, dialogList]);

    const handleClose = () => {
        setIsDialogOpen(false);
        setDialog();
    };

    return (
        <InputDialogContext.Provider value={[updateDialog]}>
            {dialog && (
                <DialogProvider close={handleClose} customClass="input-dialog"
                                disableClosing={dialog.disableCloseButton}>
                    <DialogArea dialog={dialog}/>
                </DialogProvider>
            )}
            {props.children}
        </InputDialogContext.Provider>
    );
};
