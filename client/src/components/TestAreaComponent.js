import {useContext, useEffect, useState} from "react";
import Speedtest from "./SpeedtestComponent";
import {getIconBySpeed} from "../HelperFunctions";
import {ConfigContext} from "../context/ConfigContext";

function TestArea() {
    const config = useContext(ConfigContext);
    const [tests, setTests] = useState([]);

    useEffect(() => {
        let passwordHeaders = localStorage.getItem("password") ? {password: localStorage.getItem("password")} : {}
        fetch("/api/speedtests", {headers: passwordHeaders})
            .then(res => res.json())
            .then(tests => setTests(tests));
    }, [setTests]);

    if (Object.entries(config).length === 0) return (<></>)

    return (
        <div className="individual-area">
            <div className="speedtests">
                {tests.map ? tests.map(test => {
                    let date = new Date(Date.parse(test.created));
                    let timeString = String(date.getHours()).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0');
                    return <Speedtest time={timeString}
                                      ping={test.ping} pingLevel={getIconBySpeed(test.ping, config.ping, false)}
                                      down={test.download}
                                      downLevel={getIconBySpeed(test.download, config.download, true)}
                                      up={test.upload} upLevel={getIconBySpeed(test.upload, config.upload, true)}
                                      key={test.id}
                    />
                }) : ""}
            </div>
        </div>
    );
}

export default TestArea;