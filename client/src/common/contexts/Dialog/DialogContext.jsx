import React, {useState, createContext, useEffect, useRef} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClose} from "@fortawesome/free-solid-svg-icons";
import "./styles.sass";
import {t} from "i18next";

export const DialogContext = createContext({});

const Dialog = ({dialog, setDialog}) => {
    if (!dialog) return;

    const [value, setValue] = useState(dialog.value || "");
    const ref = useRef();

    document.onkeyup = e => {
        if (ref.current == null) return;
        if (e.key === "Enter") {
            e.preventDefault();
            submit();
        }
        if (e.key === "Escape" && !dialog.disableCloseButton) {
            e.preventDefault();
            closeDialog();
        }
    }

    function updateValue(e) {
        if (dialog.updateDescription) dialog.description = dialog.updateDescription(e.target.value);
        setValue(e.target.value);
    }

    function closeSlow() {
        if (ref.current == null) return;
        ref.current.classList.add("dialog-hidden");
        setTimeout(() => setDialog(), 300);
    }

    function closeDialog() {
        closeSlow();
        if (dialog.onClose) dialog.onClose();
    }

    function submit() {
        if (!dialog.description && !value) return;
        closeSlow();
        if (dialog.onSuccess) dialog.onSuccess(value);
    }

    function clear() {
        closeSlow();
        if (dialog.onClear) dialog.onClear();
    }

    if (dialog.speedtest) return (
        <div className="dialog-area" ref={ref}>
            <div className="dialog dialog-speedtest">
                <div className="lds-ellipsis">
                    <div/><div/><div/><div/>
                </div>
            </div>
        </div>
    )

    return (
        <div className="dialog-area" ref={ref}>
            <div className="dialog">
                <div className="dialog-header">
                    <h4 className="dialog-text">{dialog.title}</h4>
                    {!dialog.disableCloseButton ? <FontAwesomeIcon icon={faClose} className="dialog-text dialog-icon" onClick={closeDialog}/> : <></>}
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
                                                  onClick={clear}>{dialog.unsetButton || t("dialog.unset")}</button> : ""}
                    <button className="dialog-btn" onClick={submit}>{dialog.buttonText || t("dialog.update")}</button>
                </div>
            </div>
        </div>
    )
}

export const DialogProvider = (props) => {
    const [dialog, setDialog] = useState();

    const hideTooltips = (state) => Array.from(document.getElementsByClassName("tooltip")).forEach(element => {
        if (state && !element.classList.contains("tooltip-invisible"))
            element.classList.add("tooltip-invisible");
        if (!state && element.classList.contains("tooltip-invisible"))
            element.classList.remove("tooltip-invisible");
    });

    useEffect(() => {
        hideTooltips(dialog);
    }, [dialog]);

    return (
        <DialogContext.Provider value={[setDialog]}>
            <Dialog dialog={dialog} setDialog={setDialog}/>
            {props.children}
        </DialogContext.Provider>
    )
}