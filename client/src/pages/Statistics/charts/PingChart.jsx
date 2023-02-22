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
    const chartData = {
        labels: props.labels,
        datasets: [
            {
                label: t("latest.ping"),
                data: props.data.ping,
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