import "./styles.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFileLines} from "@fortawesome/free-solid-svg-icons";
import {t} from "i18next";

export const documents = [
    {url: "https://www.speedtest.net/about/terms", title: "Ookla ToS"},
    {url: "https://www.speedtest.net/about/eula", title: "Ookla EULA"},
    {url: "https://www.speedtest.net/about/privacy", title: "Ookla GDPR"}
]

export const OoklaLicense = () => {
    return (
        <div className="ookla-license">
            <h2>{t("welcome.accept_title")}</h2>
            <p>
                {t("welcome.accept_subtext")}
            </p>
            <div className="documents">
                {documents.map((document, index) => (
                    <a className="document" key={index} href={document.url}
                          target="_blank" rel="noreferrer">
                        <FontAwesomeIcon icon={faFileLines}   />
                        <p>{document.title}</p>
                    </a>
                ))}
            </div>
        </div>
    );
}