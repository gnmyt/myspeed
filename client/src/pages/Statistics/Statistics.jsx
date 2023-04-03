import {
    ArcElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    RadialLinearScale,
    Title,
    Tooltip
} from "chart.js";
import {SpeedtestContext} from "@/common/contexts/Speedtests";
import {useContext, useEffect, useState} from "react";
import Failed from "@/pages/Statistics/charts/FailedChart";
import {jsonRequest} from "@/common/utils/RequestUtil";
import SpeedChart from "@/pages/Statistics/charts/SpeedChart";
import LatestTestChart from "@/pages/Statistics/charts/LatestTestChart";
import PingChart from "@/pages/Statistics/charts/PingChart";
import DurationChart from "@/pages/Statistics/charts/DurationChart";
import OverviewChart from "@/pages/Statistics/charts/OverviewChart";
import ManualChart from "@/pages/Statistics/charts/ManualChart";
import AverageChart from "@/pages/Statistics/charts/AverageChart";
import i18n, {t} from "i18next";
import "./styles.sass";

const generatePath = (level = 1) => {
    if (level <= 2) return level;
    if (level === 3) return 7;
    return 30;
}

ChartJS.register(ArcElement, Tooltip, CategoryScale, LinearScale, PointElement, LineElement, Title, Legend, RadialLinearScale);
ChartJS.defaults.color = "#B0B0B0";
ChartJS.defaults.font.color = "#B0B0B0";
ChartJS.defaults.font.family = "Roboto";


export const Statistics = () => {
    const [statistics, setStatistics] = useState(null);
    const [tests] = useContext(SpeedtestContext);

    const updateStats = () => jsonRequest("/speedtests/statistics/?days=" + generatePath(parseInt(localStorage.getItem("testTime") || 1)))
        .then(statistics => setStatistics(statistics));

    useEffect(() => {
        updateStats();
    }, [tests]);

    useEffect(() => {
        const callback = () => updateStats();
        i18n.on("languageChanged", callback);
        return () => i18n.off("languageChanged", callback);
    }, []);

    if (!statistics) return <></>;
    if (!tests) return <></>;
    if (tests.length === 0) return <h2 className="error-text">{t("test.not_available")}</h2>;

    return (
        <div className="statistic-area">
            <OverviewChart tests={statistics.tests} time={statistics.time}/>
            <LatestTestChart test={tests.length !== 0 ? tests[0] : null}/>
            <Failed tests={statistics.tests}/>

            <SpeedChart labels={statistics.labels} data={statistics.data}/>

            <ManualChart tests={statistics.tests}/>

            <DurationChart time={statistics.data?.time}/>
            <PingChart labels={statistics.labels} data={statistics.data}/>

            <AverageChart title={t("statistics.values.down")} data={statistics.download}/>
            <AverageChart title={t("statistics.values.up")} data={statistics.upload}/>
        </div>
    );
}