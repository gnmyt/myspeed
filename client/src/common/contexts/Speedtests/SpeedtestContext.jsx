import React, {useState, createContext, useEffect} from "react";
import {jsonRequest} from "@/common/utils/RequestUtil";

export const SpeedtestContext = createContext({});

export const SpeedtestProvider = (props) => {

    const [speedtests, setSpeedtests] = useState({});

    const generatePath = (level = 1) => {
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

    const updateTests = () => jsonRequest("/speedtests" + generatePath(parseInt(localStorage.getItem("testTime") || 1)))
        .then(tests => setSpeedtests(tests));


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