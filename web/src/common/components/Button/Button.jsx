import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "./styles.sass";

export const Button = ({color, text, icon, onClick, disabled}) => {
    return (
        <button className={`btn btn-color-${color}`} onClick={onClick} disabled={disabled}>
            <FontAwesomeIcon icon={icon}/>
            <h1>{text}</h1>
        </button>
    );
}