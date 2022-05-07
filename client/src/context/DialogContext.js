import React, {useState, createContext} from "react";
import "../style/Dialog.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClose} from "@fortawesome/free-solid-svg-icons";

export const DialogContext = createContext();

const Dialog = ({dialog, setDialog}) => {
    const [value, setValue] = useState(dialog.value || "");

    document.onkeyup = e => {
        if (e.key === "Enter") {
            e.preventDefault();
            submit();
        }
    }

    function updateValue(e) {
        setValue(e.target.value);
    }

    function closeDialog() {
        setDialog();
        if (dialog.onClose) dialog.onClose();
    }

    function submit() {
        setDialog();
        if (dialog.onSuccess) dialog.onSuccess(value);
    }

    function clear() {
        setDialog();
        if (dialog.onClear) dialog.onClear();
    }

    if (dialog.speedtest) {
        dialog.promise.then(() => window.location.reload());

        return (
            <div className="dialog-area">
                <div className="dialog dialog-speedtest">
                    <div className="lds-ellipsis"><div/><div/><div/><div/></div>
                </div>
            </div>
        )
    }

    return (
        <div className="dialog-area">
            <div className="dialog">
                <div className="dialog-header">
                    <h4 className="dialog-text">{dialog.title}</h4>
                    <FontAwesomeIcon icon={faClose} className="dialog-text dialog-icon" onClick={closeDialog}/>
                </div>
                <div className="dialog-main">
                    {dialog.description ? <h3 className="dialog-description">{dialog.description}</h3>: ""}
                    {dialog.placeholder ? <input className="dialog-input" type={dialog.password ? "password" : "text"} placeholder={dialog.placeholder} value={value}
                                                 onChange={updateValue}/> : ""}
                </div>
                <div className="dialog-buttons">
                    {dialog.unsetButton ? <button className="dialog-btn dialog-secondary" onClick={clear}>{dialog.unsetButtonText || "Entfernen"}</button> : ""}
                    <button className="dialog-btn" onClick={submit}>{dialog.buttonText || "Aktualisieren"}</button>
                </div>
            </div>
        </div>
    )
}

export const DialogProvider = (props) => {
    const [dialog, setDialog] = useState();

    return (
        <DialogContext.Provider value={[setDialog]}>
            {dialog && <Dialog dialog={dialog} setDialog={setDialog}/>}
            {props.children}
        </DialogContext.Provider>
    )
}