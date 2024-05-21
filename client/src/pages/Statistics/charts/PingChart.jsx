import {Line} from "react-chartjs-2";
import StatisticContainer from "@/pages/Statistics/components/StatisticContainer";
import {t} from "i18next";

const chartOptions = {
    plugins: {
        tooltip: {
            callbacks: {
                label: (item) => item.dataset.label + ": " + item.formattedValue + " " + t("latest.ping_unit")
            }
        },
        legend: {
            display: false
        }
    },
    scales: {x: {reverse: true}},
    responsive: true
};

const SpeedChart = (props) => {
    const testTime = localStorage.getItem("testTime") || 1;
    const chartData = {
        labels: testTime < 3 ? props.labels.map((label) => new Date(label).toLocaleTimeString([],
            {hour: "2-digit", minute: "2-digit"})) : props.labels.slice(1).map((label) =>
            new Date(label).toLocaleDateString()),
        datasets: [
            {
                label: t("latest.ping"),
                data: testTime < 3 ? props.data.ping : props.data.ping.slice(1),
                borderColor: '#45C65A',
            },
        ],
    };

    return (
        <StatisticContainer title={t("latest.ping")} size="normal" center={true}>
            <Line data={chartData} options={chartOptions}/>
        </StatisticContainer>
    )

}
export default SpeedChart;