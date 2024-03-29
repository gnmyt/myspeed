import "./styles.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCircleArrowUp, faDownload,
    faGaugeHigh,
    faGear,
    faLock,
    faServer
} from "@fortawesome/free-solid-svg-icons";
import {useContext, useEffect, useState} from "react";
import DropdownComponent, {toggleDropdown} from "../Dropdown/DropdownComponent";
import {InputDialogContext} from "@/common/contexts/InputDialog";
import {StatusContext} from "@/common/contexts/Status";
import {SpeedtestContext} from "@/common/contexts/Speedtests";
import {jsonRequest, postRequest} from "@/common/utils/RequestUtil";
import {updateInfo} from "@/common/components/Header/utils/infos";
import {t} from "i18next";
import {ConfigContext} from "@/common/contexts/Config";
import {LoadingDialog} from "@/common/components/LoadingDialog";
import {NodeContext} from "@/common/contexts/Node";
import {WEB_URL} from "@/index";
import {Trans} from "react-i18next";

function HeaderComponent(props) {
    const findNode = useContext(NodeContext)[4];
    const currentNode = useContext(NodeContext)[2];

    const [setDialog] = useContext(InputDialogContext);
    const [icon, setIcon] = useState(faGear);
    const [status, updateStatus] = useContext(StatusContext);
    const [startedManually, setStartedManually] = useState(false);
    const updateTests = useContext(SpeedtestContext)[1];
    const [config, reloadConfig, checkConfig] = useContext(ConfigContext);
    const [updateAvailable, setUpdateAvailable] = useState("");

    function switchDropdown() {
        toggleDropdown(setIcon);
    }

    const showDemoDialog = () => setDialog({
        title: t("preview.title"),
        description: <Trans components={{Link: <a href={WEB_URL + "/install"} target="_blank" />}}>preview.description</Trans>,
        buttonText: t("dialog.okay")
    });

    const showPasswordDialog = () => setDialog({
        title: t("header.admin_login"),
        placeholder: t("dialog.password.placeholder"),
        description: localStorage.getItem("password") ? <span className="icon-red">{t("dialog.password.wrong")}</span> : "",
        type: "password",
        buttonText: t("dialog.login"),
        onSuccess: (value) => {
            localStorage.setItem("password", value);
            reloadConfig();
            checkConfig().then((config) => config?.viewMode ? showPasswordDialog() : false).catch(() => showPasswordDialog());
        },
        onClose: () => {
            localStorage.removeItem("password");
        }
    });

    const startSpeedtest = async () => {
        await updateStatus();
        if (status.paused) return setDialog({
            title: t("failed"),
            description: t("header.paused"),
            buttonText: t("dialog.okay")
        });

        if (status.running) return setDialog({
            title: t("failed"),
            description: t("header.running"),
            buttonText: t("dialog.okay")
        });

        setStartedManually(true);

        postRequest("/speedtests/run").then(updateTests).then(updateStatus).then(() => setStartedManually(false));
    }

    const openDownloadPage = () => window.open(WEB_URL + "/install", "_blank");

    useEffect(() => {
        if (Object.keys(config).length === 0) return;
        async function updateVersion() {
            const version = await jsonRequest("/info/version");

            if (version.remote.localeCompare(version.local, undefined, {numeric: true, sensitivity: 'base'}) === 1)
                setUpdateAvailable(version.remote);
        }

        if (!config.viewMode) updateVersion();
    }, [config]);

    const getNodeName = () => currentNode === "0" ? t("header.title") : findNode(currentNode)?.name || t("header.title");

    if (Object.keys(config).length === 0) return <></>;

    return (
        <header>
            <LoadingDialog isOpen={startedManually}/>
            <div className="header-main">
                <div className="header-left">
                    {config.viewMode && <h2>{t("header.title")}</h2>}
                    {!config.viewMode &&  <h2 onClick={() => props.showNodePage(true)} className="h2-click"><FontAwesomeIcon icon={faServer} /> {getNodeName()}</h2>}

                    {config.previewMode && <h2 className="demo-info" onClick={showDemoDialog}>{t("preview.info")}</h2>}
                </div>


                <div className="header-right">
                    {updateAvailable ?
                        <div><FontAwesomeIcon icon={faCircleArrowUp} className="header-icon icon-orange update-icon"
                                              onClick={() => setDialog({
                                                  title: t("header.new_update"),
                                                  buttonText: t("dialog.okay"),
                                                  description: updateInfo(updateAvailable)
                                              })}/></div> : <></>}

                    {!(status.paused || config.viewMode) ? <div className="tooltip-element tooltip-bottom">
                        <FontAwesomeIcon icon={faGaugeHigh}
                                         className={"header-icon " + (status.running ? "test-running" : "")}
                                         onClick={startSpeedtest}/>
                        <span className="tooltip">{t("header." + (status.running ? "running_tooltip" : "start_tooltip"))}</span>
                    </div> : <></>}

                    {(config.viewMode ? <div className="tooltip-element tooltip-bottom">
                        <FontAwesomeIcon icon={faLock} className={"header-icon"} onClick={showPasswordDialog}/>
                        <span className="tooltip">{t("header.admin_login")}</span>
                    </div> : <></>)}

                    {(config.previewMode ? <div className="tooltip-element tooltip-bottom">
                        <FontAwesomeIcon icon={faDownload} className={"header-icon"} onClick={openDownloadPage}/>
                        <span className="tooltip">{t("header.download")}</span>
                    </div> : <></>)}

                    <div className="tooltip-element tooltip-bottom" id="open-header">
                        <FontAwesomeIcon icon={icon} className="header-icon" onClick={switchDropdown}/>
                        <span className="tooltip">{t("dropdown.settings")}</span>
                    </div>
                </div>
            </div>
            <DropdownComponent/>
        </header>
    )
}

export default HeaderComponent;