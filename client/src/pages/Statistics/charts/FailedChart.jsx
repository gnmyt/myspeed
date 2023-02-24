import {Doughnut} from "react-chartjs-2";
import StatisticContainer from "@/pages/Statistics/components/StatisticContainer";
import {t} from "i18next";

const chartOptions = {
    plugins: {
        legend: {
            display: false
        }
    },
    responsive: true,
    cutout: 80
};

const FailedChart = (props) => {

    const chartData = {
        labels: [t("statistics.failed.success"), t("statistics.failed.failed")],
        datasets: [{
            label: t("statistics.failed.label"),
            data: [props.tests.total - props.tests.failed, props.tests.failed],
            backgroundColor: ['#456AC6', '#C64545'],
            borderWidth: 0
        }]
    };

    return (
        <StatisticContainer title={t("statistics.failed.title")} center={true}>
            <Doughnut data={chartData} options={chartOptions}/>
        </StatisticContainer>
    );
}


export default FailedChart;