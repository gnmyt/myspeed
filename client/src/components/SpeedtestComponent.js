import {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown, faArrowUp, faClockRotateLeft, faPingPongPaddleBall} from "@fortawesome/free-solid-svg-icons";
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
                        <FontAwesomeIcon icon={faPingPongPaddleBall} className={"speedtest-icon icon-" + this.props.pingLevel}/>
                        <h2 className="speedtest-text">{this.props.ping}</h2>
                    </div>
                    <div className="speedtest-row">
                        <FontAwesomeIcon icon={faArrowDown} className={"speedtest-icon icon-" + this.props.downLevel} />
                        <h2 className="speedtest-text">{this.props.down}</h2>
                    </div>
                    <div className="speedtest-row">
                        <FontAwesomeIcon icon={faArrowUp} className={"speedtest-icon icon-" + this.props.upLevel}/>
                        <h2 className="speedtest-text">{this.props.up}</h2>
                    </div>
                </div>
            </div>
        );
    }
}

export default Speedtest;