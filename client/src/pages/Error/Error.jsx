import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import "./styles.sass";

export const Error = (props) => {
    const [reloadTimer, setReloadTimer] = useState(5);

    useEffect(() => {
        const interval = setInterval(() => {
            if (reloadTimer > 0) {
                setReloadTimer(reloadTimer - 1)
            } else {
                window.location = window.location.href;
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [reloadTimer]);

    return (
        <div className="error-page">
            <FontAwesomeIcon icon={faExclamationTriangle} size="8x"/>
            <h1>{props.text}</h1>
            <h2>Reloading {reloadTimer !== 0 ? <>in <span>{reloadTimer}</span> seconds</> : <span>now</span>}...</h2>
        </div>
    )
}