import {DialogContext, DialogProvider} from "@/common/contexts/Dialog";
import {t} from "i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faClose} from "@fortawesome/free-solid-svg-icons";
import "./styles.sass";
import React, {useContext, useEffect, useState} from "react";
import OoklaImage from "./assets/img/ookla.webp";
import LibreImage from "./assets/img/libre.webp";
import CloudflareImage from "./assets/img/cloudflare.webp";
import {jsonRequest, patchRequest} from "@/common/utils/RequestUtil";
import {Trans} from "react-i18next";
import {ConfigContext} from "@/common/contexts/Config";
import {ToastNotificationContext} from "@/common/contexts/ToastNotification";

export const providers = [
    {id: "ookla", name: "Ookla", image: OoklaImage},
    {id: "libre", name: "LibreSpeed", image: LibreImage},
    {id: "cloudflare", name: "Cloudflare", image: CloudflareImage}
]


export const Dialog = () => {
    const close = useContext(DialogContext);
    const [config, reloadConfig] = useContext(ConfigContext);
    const updateToast = useContext(ToastNotificationContext);
    const [provider, setProvider] = useState(config.provider || "ookla");

    const [licenseAccepted, setLicenseAccepted] = useState(false);
    const [licenseError, setLicenseError] = useState(false);

    const [interfaces, setInterfaces] = useState({});
    const [currentInterface, setCurrentInterface] = useState(config.interface || "none");
    const [ooklaServers, setOoklaServers] = useState({});
    const [libreServers, setLibreServers] = useState({});

    const [serverId, setServerId] = useState("none");

    useEffect(() => {
        jsonRequest("/info/server/ookla").then((response) => {
            setOoklaServers(response);
        });
        jsonRequest("/info/server/libre").then((response) => {
            setLibreServers(response);
        });
        jsonRequest("/info/interfaces").then((response) => {
            setInterfaces(response);
        });
    }, []);

    useEffect(() => {
        if (config[provider + "Id"]) setServerId(config[provider + "Id"]);
    }, [provider]);

    useEffect(() => {
        if (serverId === "") setServerId("none");
    }, [serverId]);

    const update = async () => {
        if (provider === "ookla" && !licenseAccepted) {
            setLicenseError(true);
            return;
        }

        await patchRequest("/config/provider", {value: provider});

        if (serverId !== config[provider + "Id"] && provider !== "cloudflare") {
            await patchRequest("/config/" + provider + "Id", {value: serverId});
        }

        if (currentInterface !== config.interface) {
            await patchRequest("/config/interface", {value: currentInterface});
        }

        reloadConfig();
        updateToast(t('dropdown.provider_changed'), "green", faCheck);

        close();
    }

    return (
        <>
            <div className="dialog-header">
                <h4 className="dialog-text">{t("update.provider_title")}</h4>
                <FontAwesomeIcon icon={faClose} className="dialog-text dialog-icon" onClick={() => close()}/>
            </div>
            <div className="provider-dialog-content">
                <div className="provider-header">
                    {providers.map((current, index) => (
                        <div className={`provider-item ${current.id === provider ? "provider-item-active" : ""}`}
                             key={index} onClick={() => setProvider(current.id)}>
                            <img src={current.image} alt={current.name}/>
                            <h3>{current.name}</h3>
                        </div>
                    ))}
                </div>
                <div className="provider-content">
                    <div className="provider-setting">
                        <h3>{t("dialog.provider.interface")}</h3>
                        <select className="dialog-input provider-input" value={currentInterface}
                                onChange={(e) => setCurrentInterface(e.target.value)}>
                            {interfaces && Object.keys(interfaces).map((current, index) => (
                                <option key={index} value={current}>{current} ({interfaces[current]})</option>
                            ))}
                        </select>
                    </div>

                    {provider !== "cloudflare" && <>
                        <div className="provider-setting">
                            <h3>{t("dialog.provider.server")}</h3>
                            <select className="dialog-input provider-input" value={serverId}
                                    onChange={(e) => setServerId(e.target.value)}>
                                <option value="none">{t("dialog.provider.choose_automatically")}</option>
                                {provider === "ookla" && Object.keys(ooklaServers).map((current, index) => (
                                    <option key={index} value={current}>{ooklaServers[current]}</option>
                                ))}
                                {provider === "libre" && Object.keys(libreServers).map((current, index) => (
                                    <option key={index} value={current}>{libreServers[current]}</option>
                                ))}
                            </select>
                        </div>
                        <div className="provider-setting">
                            <h3>{t("dialog.provider.server_id")}</h3>
                            <input type="text" className="dialog-input provider-input"
                                   value={serverId === "none" ? "" : serverId}
                                   onChange={(e) => setServerId(e.target.value)}/>
                        </div>
                    </>}
                </div>
            </div>
            <div className="provider-dialog-footer">
                <div className="provider-license-box">
                    {provider === "ookla" && <>
                        <input type="checkbox" className={licenseError ? "cb-error" : ""} id="license" name="license"
                               onChange={(e) => setLicenseAccepted(e.target.checked)}/>
                        <label htmlFor="license"
                        ><Trans components={{
                            Eula: <a href="https://www.speedtest.net/about/eula" target="_blank"
                                     rel="noreferrer"/>,
                            GDPR: <a href="https://www.speedtest.net/about/privacy" target="_blank"
                                     rel="noreferrer"/>,
                            TOS: <a href="https://www.speedtest.net/about/terms" target="_blank"
                                    rel="noreferrer"/>}}>dialog.provider.ookla_license</Trans></label>
                    </>}
                </div>

                <button className="dialog-btn" onClick={update}>{t("dialog.update")}</button>
            </div>
        </>
    )
}

export const ProviderDialog = (props) => {
    return (
        <>
            <DialogProvider close={props.onClose}>
                <Dialog/>
            </DialogProvider>
        </>
    )
}