import "../style/Header.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGear} from "@fortawesome/free-solid-svg-icons";
import DropdownComponent, {toggleDropdown} from "./DropdownComponent";
import {useState} from "react";

function HeaderComponent() {

    const [icon, setIcon] = useState(faGear);

    function switchDropdown() {
        toggleDropdown(setIcon);
    }

    return (
        <header>
            <div className="header-main">
                <h2>Netzwerkanalyse</h2>
                <FontAwesomeIcon icon={icon} className="settings" onClick={switchDropdown}/>
            </div>
            <DropdownComponent/>
        </header>
    )

}

export default HeaderComponent;