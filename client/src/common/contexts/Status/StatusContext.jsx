import React, {useState, createContext, useEffect} from "react";
import {jsonRequest} from "@/common/utils/RequestUtil";

export const StatusContext = createContext({});

export const StatusProvider = (props) => {

    const [status, setStatus] = useState({paused: false, running: false});

    const updateStatus = () => {
        jsonRequest("/speedtests/status").then(status => setStatus(status))
    }

    useEffect(() => {
        updateStatus();
        const interval = setInterval(() => updateStatus(), 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <StatusContext.Provider value={[status, updateStatus]}>
            {props.children}
        </StatusContext.Provider>
    )
}