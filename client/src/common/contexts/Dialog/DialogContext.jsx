import React, {useState, createContext, useContext} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClose} from "@fortawesome/free-solid-svg-icons";
import {SpeedtestContext} from "../Speedtests";
import "./styles.sass";

export const DialogContext = createContext();

const Dialog = ({dialog, setDialog}) => {
    const updateTests = useContext(SpeedtestContext)[1];
    const [value, setValue] = useState(dialog.value || "");

    document.onkeyup = e => {
        if (e.key === "Enter") {
            e.preventDefault();
            submit();
        }
        if (e.key === "Escape") {
            e.preventDefault();
            closeDialog();
        }
    }

    function updateValue(e) {
        setValue(e.target.value);
    }

    function hideTooltips(state) {
        Array.from(document.getElementsByClassName("tooltip")).forEach(element => {
            if (state && !element.classList.contains("tooltip-invisible")) {
                element.classList.add("tooltip-invisible");
            } else if (!state && element.classList.contains("tooltip-invisible")) {
                element.classList.remove("tooltip-invisible");
            }
        });
    }

    function closeDialog() {
        setDialog();
        hideTooltips(false);
        if (dialog.onClose) dialog.onClose();
    }

    function submit() {
        setDialog();
        hideTooltips(false);
        if (dialog.onSuccess) dialog.onSuccess(value);
    }

    function clear() {
        setDialog();
        if (dialog.onClear) dialog.onClear();
    }

    hideTooltips(true);

    if (dialog.speedtest) {
        dialog.promise.then(res => {
            if (res.status === 409) {
                setDialog({
                    title: "Fehlgeschlagen",
                    description: "Es läuft bereits ein Speedtest. Bitte gedulde dich ein wenig, bis dieser fertig ist.",
                    buttonText: "Okay"
                });
            } else if (res.status === 410) {
                setDialog({
                    title: "Fehlgeschlagen",
                    description: "Speedtests sind aktuell pausiert. Bitte setze sie fort, wenn du einen machen möchtest.",
                    buttonText: "Okay"
                });
            } else {
                updateTests();
                setDialog();
            }
        });

        return (
            <div className="dialog-area">
                <div className="dialog dialog-speedtest">
                    <div className="lds-ellipsis">
                        <div/>
                        <div/>
                        <div/>
                        <div/>
                    </div>
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
                    {dialog.description ? <h3 className="dialog-description">{dialog.description}</h3> : ""}
                    {dialog.placeholder ? <input className="dialog-input" type={dialog.type ? dialog.type : "text"}
                                                 placeholder={dialog.placeholder} value={value}
                                                 onChange={updateValue}/> : ""}
                    {dialog.select ? <select value={value} onChange={updateValue} className="dialog-input">
                        {Object.keys(dialog.selectOptions).map(key => <option key={key}
                                                                              value={key}>{dialog.selectOptions[key]}</option>)}
                    </select> : ""}
                </div>
                <div className="dialog-buttons">
                    {dialog.unsetButton ? <button className="dialog-btn dialog-secondary"
                                                  onClick={clear}>{dialog.unsetButtonText || "Entfernen"}</button> : ""}
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
            {dialog ? <Dialog dialog={dialog} setDialog={setDialog}/> : <></>}
            {props.children}
        </DialogContext.Provider>
    )
}