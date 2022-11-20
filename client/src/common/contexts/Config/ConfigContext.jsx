import React, {createContext, useContext, useEffect, useState} from "react";
import {DialogContext} from "../Dialog";
import {request} from "@/common/utils/RequestUtil";
import {acceptDialog, apiErrorDialog, passwordRequiredDialog} from "@/common/contexts/Config/dialog";

export const ConfigContext = createContext({});

export const ConfigProvider = (props) => {

    const [config, setConfig] = useState({});
    const [setDialog] = useContext(DialogContext);

    const reloadConfig = () => {
        request("/config").then(async res => {
            if (res.status === 401) throw 1;
            if (!res.ok) throw 5;
            
            try {
                return JSON.parse(await res.text());
            } catch (e) {
                throw 5;
            }
        })
            .then(result => setConfig(result))
            .catch((code) => setDialog(code === 5 ? apiErrorDialog() : passwordRequiredDialog()));
    }

    useEffect(() => {
        if (config.acceptOoklaLicense !== undefined && config.acceptOoklaLicense === "false")
            setDialog(acceptDialog());
    }, [config]);

    useEffect(reloadConfig, []);

    return (
        <ConfigContext.Provider value={[config, reloadConfig]}>
            {props.children}
        </ConfigContext.Provider>
    )
}