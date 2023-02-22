import StatisticContainer from "@/pages/Statistics/components/StatisticContainer";
import {PolarArea} from "react-chartjs-2";
import {useEffect, useState} from "react";
import {t} from "i18next";

const chartOptions = {
    plugins: {
        legend: {
            display: false
        }
    },
    scales: {
        r: {
            ticks: {
                color: "#B0B0B0",
                backdropColor: "transparent",
            }
        }
    }
}

const DurationChart = (props) => {

    const [data, setData] = useState({
        labels: [],
        datasets: [{
            label: t("statistics.duration.label"),
            data: [],
            backgroundColor: ['#45C65A', '#456AC6', '#C64545', '#C6C645', '#C645C6'],
            borderWidth: 0,
        },],
    });

    useEffect(() => {
        const frequencies = {};
        let tempData = {...data};
        props.time.forEach(second => {
            frequencies[second] ? frequencies[second]++ : frequencies[second] = 1;
        });

        for (let second in frequencies) {
            tempData.labels.push(t("time.seconds", {replace: {seconds: second.toString()}}));
            tempData.datasets[0].data.push(frequencies[second]);
        }
        setData(tempData);

    }, []);

    return (
        <StatisticContainer title={t("statistics.duration.title")} size="small" center={true}>
            <PolarArea data={data} options={chartOptions}/>
        </StatisticContainer>

    );

}

export default DurationChart;