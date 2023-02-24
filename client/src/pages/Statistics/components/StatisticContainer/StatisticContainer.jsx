import "./styles.sass";

export const StatisticContainer = (props) => {

    return (
        <div className={"stats-container" + (props.size ? " container-" + props.size : "")}>
            <div className="stats-header">
                {props.title}
            </div>
            <div className={"stats-content " + (props.center ?" container-center" : "")}>
                {props.children}
            </div>
        </div>
    );
}