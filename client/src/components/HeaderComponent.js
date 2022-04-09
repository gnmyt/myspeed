import "../style/Header.sass";
import {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGear} from "@fortawesome/free-solid-svg-icons";
import DropdownComponent, {toggleDropdown} from "./DropdownComponent";

class HeaderComponent extends Component {

    render() {
        return (
            <header>
                <div className="header-main">
                    <h2>Netzwerkanalyse</h2>
                    <FontAwesomeIcon icon={faGear} className="settings" onClick={toggleDropdown}/>
                </div>
                <DropdownComponent/>
            </header>
        )
    }

}

export default HeaderComponent;