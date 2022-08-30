import {useContext} from "react";
import {ConfigContext} from "@/common/contexts/Config";
import {SpeedtestContext} from "@/common/contexts/Speedtests";
import Speedtest from "../Speedtest";
import {getIconBySpeed} from "@/common/utils/TestUtil";
import "./styles.sass";

function TestArea() {
    const config = useContext(ConfigContext)[0];
    const [speedtests] = useContext(SpeedtestContext);

    if (Object.entries(config).length === 0) return (<></>);

    if (speedtests.length === 0) return <h2 className="error-text">Es liegen aktuell keine Tests vor</h2>

    return (
        <div className="speedtest-area">
            {speedtests.map ? speedtests.map(test => {
                let date = new Date(Date.parse(test.created));

                let item = localStorage.getItem("testTime");
                if ((item === "3" || item === "4") && test.type !== "average") return;

                let id = (test.type === "average") ? date.getDate() + "-" + date.getMonth() : test.id;

                return <Speedtest time={date}
                                  ping={test.ping} pingLevel={getIconBySpeed(test.ping, config.ping, false)}
                                  down={test.download} downLevel={getIconBySpeed(test.download, config.download, true)}
                                  up={test.upload} upLevel={getIconBySpeed(test.upload, config.upload, true)}
                                  error={test.error}
                                  key={id}
                                  url={test.url}
                                  type={test.type}
                                  duration={test.time}
                                  amount={test.amount}
                                  id={id}
                />
            }) : ""}
        </div>
    );
}

export default TestArea;