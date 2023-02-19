import React, {createContext, useContext, useEffect, useState} from "react";
import {InputDialogContext} from "../InputDialog";
import {request} from "@/common/utils/RequestUtil";
import {acceptDialog, apiErrorDialog, passwordRequiredDialog} from "@/common/contexts/Config/dialog";

export const ConfigContext = createContext({});

export const ConfigProvider = (props) => {

    const [config, setConfig] = useState({});
    const [setDialog] = useContext(InputDialogContext);
    const [dialogShown, setDialogShown] = useState(false);

    const reloadConfig = () => {
        request("/config").then(async res => {
            if (res.status === 401) throw 1;
            if (!res.ok) throw 2;
            
            try {
                return JSON.parse(await res.text());
            } catch (e) {
                throw 2;
            }
        })
            .then(result => config !== result ? setConfig(result) : null)
            .catch((code) => setDialog(code === 1 ? passwordRequiredDialog() : apiErrorDialog()));
    }

    const checkConfig = async () => (await request("/config")).json();

    useEffect(() => {
        if (config.acceptOoklaLicense !== undefined && config.acceptOoklaLicense === "false" && !dialogShown) {
            console.log(config)
            setDialogShown(true);
            setDialog(acceptDialog());
        }
    }, [config]);

    useEffect(reloadConfig, []);

    return (
        <ConfigContext.Provider value={[config, reloadConfig, checkConfig]}>
            {props.children}
        </ConfigContext.Provider>
    )
}