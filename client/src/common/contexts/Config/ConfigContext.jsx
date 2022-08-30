import React, {useState, createContext, useEffect, useContext} from "react";
import {DialogContext} from "../Dialog";
import {request} from "@/common/utils/RequestUtil";
import {passwordRequiredDialog} from "@/common/contexts/Config/dialog";

export const ConfigContext = createContext({});

export const ConfigProvider = (props) => {

    const [config, setConfig] = useState({});
    const [setDialog] = useContext(DialogContext);

    const reloadConfig = () => {
        request("/config").then(res => {
                if (!res.ok) throw "No connection to server";
                return res.json();
            })
            .then(result => setConfig(result))
            .catch(() => setDialog(passwordRequiredDialog));
    }

    useEffect(reloadConfig, []);

    return (
        <ConfigContext.Provider value={[config, reloadConfig]}>
            {props.children}
        </ConfigContext.Provider>
    )
}