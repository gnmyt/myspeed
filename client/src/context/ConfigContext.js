import React, {useState, createContext, useEffect, useContext} from "react";
import {DialogContext} from "./DialogContext";

export const ConfigContext = createContext();

export const ConfigProvider = (props) => {

    const [config, setConfig] = useState({});
    const [setDialog] = useContext(DialogContext);


    useEffect(() => {
        let passwordHeaders = localStorage.getItem("password") ? {password: localStorage.getItem("password")} : {}
        fetch("/api/config", {headers: passwordHeaders})
            .then(res => {
                if (!res.ok) throw new Error();
                return res;
            })
            .then(res => res.json())
            .then(result => setConfig(result))
            .catch(() => setDialog({
                title: "Passwort erforderlich",
                placeholder: "Dein Passwort",
                description: localStorage.getItem("password") ? <span className="icon-red">Das von dir eingegebene Passwort ist falsch</span> : "",
                password: true,
                onClose: () => window.location.reload(),
                onSuccess: (value) => {
                    localStorage.setItem("password", value);
                    window.location.reload();
                }
            }));
    }, [setConfig, setDialog]);

    return (
        <ConfigContext.Provider value={config}>
            {props.children}
        </ConfigContext.Provider>
    )
}