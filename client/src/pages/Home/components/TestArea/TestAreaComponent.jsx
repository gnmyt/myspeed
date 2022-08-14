import {useContext} from "react";
import {ConfigContext} from "@/common/contexts/Config";
import {SpeedtestContext} from "@/common/contexts/Speedtests";
import Speedtest from "../Speedtest";
import {getIconBySpeed} from "@/common/utils/TestUtil";

function TestArea() {
    const config = useContext(ConfigContext)[0];
    const [speedtests] = useContext(SpeedtestContext);

    if (Object.entries(config).length === 0) return (<></>)

    return (
        <div className="speedtest-area">
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
    );
}

export default TestArea;