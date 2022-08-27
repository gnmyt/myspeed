import React, {useState, createContext, useEffect} from "react";

export const StatusContext = createContext();

export const StatusProvider = (props) => {

    const [status, setStatus] = useState({paused: false, running: false});

    const updateStatus = () => {
        let headers = localStorage.getItem("password") ? {password: localStorage.getItem("password")} : {}
        fetch("/api/speedtests/status", {headers})
            .then(res => res.json())
            .then(tests => setStatus(tests))
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