import {useContext} from "react";
import Speedtest from "./SpeedtestComponent";
import {getIconBySpeed} from "../HelperFunctions";
import {ConfigContext} from "../context/ConfigContext";
import {SpeedtestContext} from "../context/SpeedtestContext";

function TestArea() {
    const config = useContext(ConfigContext);
    const [speedtests] = useContext(SpeedtestContext);

    if (Object.entries(config).length === 0) return (<></>)

    return (
        <div className="individual-area">
            <div className="speedtests">
                {speedtests.map ? speedtests.map(test => {
                    let date = new Date(Date.parse(test.created));
                    let timeString = String(date.getHours()).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0');
                    return <Speedtest time={timeString}
                                      ping={test.ping} pingLevel={getIconBySpeed(test.ping, config.ping, false)}
                                      down={test.download} downLevel={getIconBySpeed(test.download, config.download, true)}
                                      up={test.upload} upLevel={getIconBySpeed(test.upload, config.upload, true)}
                                      error={test.error}
                                      key={test.id}
                                      url={test.url}
                                      type={test.type}
                                      duration={test.time}
                                      id={test.id}
                    />
                }) : ""}
            </div>
        </div>
    );
}

export default TestArea;