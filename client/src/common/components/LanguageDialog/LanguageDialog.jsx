import {DialogContext, DialogProvider} from "@/common/contexts/Dialog";
import {t, changeLanguage} from "i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClose} from "@fortawesome/free-solid-svg-icons";
import "./styles.sass";
import {languages} from "@/i18n";
import {useContext, useState} from "react";

export const Dialog = () => {
    const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem("language") || "en");
    const close = useContext(DialogContext);

    const updateLanguage = () => {
        changeLanguage(selectedLanguage);
        close();
    }

    return (
        <>
            <div className="dialog-header">
                <h4 className="dialog-text">{t("update.language")}</h4>
                <FontAwesomeIcon icon={faClose} className="dialog-text dialog-icon" onClick={() => close()}/>
            </div>
            <div className="language-chooser-dialog">
                {languages.map((language, index) => (
                    <div key={index}
                         className={"language-chooser-item" + (selectedLanguage === language.code ? " language-selected" : "")}
                         onClick={() => setSelectedLanguage(language.code)}>
                        <img src={language.flag} alt={language.name}/>
                        <p>{language.name}</p>
                    </div>
                ))}
            </div>
            <div className="dialog-buttons">
                <button className="dialog-btn" onClick={updateLanguage}>{t("dialog.update")}</button>
            </div>
        </>
    )
}

export const LanguageDialog = (props) => {
    return (
        <>
            <DialogProvider close={props.onClose}>
                <Dialog />
            </DialogProvider>
        </>
    )
}