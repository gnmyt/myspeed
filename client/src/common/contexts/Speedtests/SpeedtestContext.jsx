import React, {useState, createContext, useEffect} from "react";

export const SpeedtestContext = createContext();

export const SpeedtestProvider = (props) => {

    const [speedtests, setSpeedtests] = useState({});

    const generatePath = (level) => {
        switch (level) {
            case 1:
                return "?hours=24";
            case 2:
                return "?hours=48";
            case 3:
                return "/averages?days=7";
            case 4:
                return "/averages?days=30";
        }
    }

    const updateTests = () => {
        let passwordHeaders = localStorage.getItem("password") ? {password: localStorage.getItem("password")} : {}
        let testTime = localStorage.getItem("testTime") || 1;

        fetch("/api/speedtests" + generatePath(parseInt(testTime)), {headers: passwordHeaders})
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