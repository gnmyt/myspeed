import "./styles.sass";

import BackgroundImage from "@/common/assets/background.png";
import Button from "@/common/components/Button/index.js";
import {faDocker, faLinux, faWindows} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBook,
    faBug,
    faCheck,
    faCopy,
    faDownload,
    faQuestionCircle,
    faTerminal
} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import {DOCUMENTATION_BASE} from "@/main.jsx";

export const INSTALL_CMD = "bash <(curl -sSL https://install.myspeed.dev)";

export const Install = () => {

    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(INSTALL_CMD);
        setIsCopied(true);

        setTimeout(() => setIsCopied(false), 1000);
    }

    const openDocs = (path) => window.open(DOCUMENTATION_BASE + path, "_blank");

    return (
        <div className="install-page">
            <img className="bg-image" src={BackgroundImage} alt="Background" draggable={false}/>

            <div className="install-container">

                <div className="install-info">

                    <div className="install-header">
                        <FontAwesomeIcon icon={faDownload}/>
                        <h1>Downloads</h1>
                    </div>

                    <Button text="Download for Windows" onClick={() => openDocs("/setup/windows")} color="green" icon={faWindows}/>

                    <Button text="Download for Linux" onClick={() => openDocs("/setup/linux")} color="green" icon={faLinux}/>

                    <div className="install-header">
                        <FontAwesomeIcon icon={faBook}/>
                        <h1>Documentation</h1>
                    </div>

                    <Button text="Instructions for Docker" onClick={() => openDocs("/setup/linux/#installation-with-docker")}
                            color="green" icon={faDocker}/>
                    <Button text="Questions & Answers" onClick={() => openDocs("/faq")} color="blue" icon={faQuestionCircle}/>

                    <Button text="Troubleshooting" onClick={() => openDocs("/troubleshooting")} color="red" icon={faBug}/>

                </div>

                <div className="install-cmd" onClick={copyToClipboard}>
                    <FontAwesomeIcon icon={faTerminal}/>
                    <code>{INSTALL_CMD}</code>
                    <FontAwesomeIcon icon={isCopied ? faCheck : faCopy} className="copy-icon"/>
                </div>

            </div>
        </div>
    );
}