import {Line} from "react-chartjs-2";
import StatisticContainer from "@/pages/Statistics/components/StatisticContainer";
import {t} from "i18next";

const chartOptions = {
    plugins: {
        tooltip: {
            callbacks: {
                label: (item) => item.dataset.label + ": " + item.formattedValue + " " + t("latest.speed_unit")
            }
        },
        legend: {
            position: "bottom"
        }
    },
    scales: {x: {reverse: true}}
};

const SpeedChart = (props) => {
    const testTime = localStorage.getItem("testTime") || 1;
    const chartData = {
        labels: testTime < 3 ? props.labels.map((label) => new Date(label).toLocaleTimeString([],
            {hour: "2-digit", minute: "2-digit"})) : props.labels.slice(1).map((label) =>
            new Date(label).toLocaleDateString()),
        datasets: [
            {
                label: t("latest.down"),
                data: testTime < 3 ? props.data.download : props.data.download.slice(1),
                borderColor: '#45C65A'
            },
            {
                label: t("latest.up"),
                data: testTime < 3 ? props.data.upload : props.data.upload.slice(1),
                borderColor: '#456AC6'
            },
        ],
    };

    return (
        <StatisticContainer title={t("statistics.speed.title")} size="normal" center={true}>
            <Line data={chartData} options={chartOptions}/>
        </StatisticContainer>
    )

}
export default SpeedChart;