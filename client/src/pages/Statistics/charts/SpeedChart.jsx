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
    const chartData = {
        labels: props.labels,
        datasets: [
            {label: t("latest.down"), data: props.data.download, borderColor: '#45C65A'},
            {label: t("latest.up"), data: props.data.upload, borderColor: '#456AC6'},
        ],
    };

    return (
        <StatisticContainer title={t("statistics.speed.title")} size="normal" center={true}>
            <Line data={chartData} options={chartOptions}/>
        </StatisticContainer>
    )

}
export default SpeedChart;