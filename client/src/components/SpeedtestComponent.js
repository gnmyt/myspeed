import {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowDown,
    faArrowUp,
    faClockRotateLeft,
    faClose,
    faPingPongPaddleBall
} from "@fortawesome/free-solid-svg-icons";
import "../style/Speedtest.sass";

class Speedtest extends Component {

    render() {
        return (
            <div>
                <div className="speedtest">
                    <div className="date">
                        <FontAwesomeIcon icon={faClockRotateLeft} className="container-icon icon-blue"/>
                        <h2 className="date-text">Um {this.props.time}</h2>
                    </div>
                    <div className="speedtest-row">
                        <FontAwesomeIcon icon={this.props.ping !== 0 ? faPingPongPaddleBall : faClose} className={"speedtest-icon icon-" + this.props.pingLevel}/>
                        <h2 className="speedtest-text">{this.props.ping === 0 ? "" : this.props.ping}</h2>
                    </div>
                    <div className="speedtest-row">
                        <FontAwesomeIcon icon={this.props.down !== 0 ? faArrowDown : faClose} className={"speedtest-icon icon-" + this.props.downLevel} />
                        <h2 className="speedtest-text">{this.props.down === 0 ? "" : this.props.down}</h2>
                    </div>
                    <div className="speedtest-row">
                        <FontAwesomeIcon icon={this.props.up !== 0 ? faArrowUp : faClose} className={"speedtest-icon icon-" + this.props.upLevel}/>
                        <h2 className="speedtest-text">{this.props.up === 0 ? "" : this.props.up}</h2>
                    </div>
                </div>
            </div>
        );
    }
}

export default Speedtest;