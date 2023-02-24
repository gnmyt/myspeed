import {Doughnut} from "react-chartjs-2";
import StatisticContainer from "@/pages/Statistics/components/StatisticContainer";
import {t} from "i18next";

const chartOptions = {
    plugins: {
        legend: {
            display: false
        }
    },
    cutout: 80
};

const ManuelChart = (props) => {

    const chartData = {
        labels: [t("statistics.manual.yes"), t("statistics.manual.no")],
        datasets: [{
            label: t("statistics.failed.label"),
            data: [props.tests.custom, props.tests.total - props.tests.custom],
            backgroundColor: ['#456AC6', '#45C65A'],
            borderWidth: 0
        }]
    };

    return (
        <StatisticContainer title={t("statistics.manual.title")} center={true}>
            <Doughnut data={chartData} options={chartOptions}/>
        </StatisticContainer>
    );
}


export default ManuelChart;