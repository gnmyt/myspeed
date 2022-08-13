import React, {useState, createContext, useEffect} from "react";

export const SpeedtestContext = createContext();

export const SpeedtestProvider = (props) => {

    const [speedtests, setSpeedtests] = useState({});

    const updateTests = () => {
        let passwordHeaders = localStorage.getItem("password") ? {password: localStorage.getItem("password")} : {}
        fetch("/api/speedtests", {headers: passwordHeaders})
            .then(res => res.json())
            .then(tests => setSpeedtests(tests))
    }

    useEffect(() => {
        updateTests();
        const interval = setInterval(() => updateTests(), 15000);
        return () => clearInterval(interval);
    }, []);

    return (
        <SpeedtestContext.Provider value={[speedtests, updateTests]}>
            {props.children}
        </SpeedtestContext.Provider>
    )
}