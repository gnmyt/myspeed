import {useEffect} from "react";
import "./styles.sass";
import NotFoundImage from "@/common/assets/not_found.svg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faQuestionCircle} from "@fortawesome/free-solid-svg-icons";

export const NotFound = () => {

    useEffect(() => {
        const timeout = setTimeout(() => {
            window.location.href = "/";
        }, 2000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="page-404">
            <div className="info-area">
                <div className="logo-container">
                    <FontAwesomeIcon icon={faQuestionCircle} size="3x" />
                    <h1>Page not found</h1>
                </div>
                <p>You will be redirected to the home page in a few seconds.</p>
            </div>
            <img src={NotFoundImage} alt="Interface" />
        </div>
    );
}