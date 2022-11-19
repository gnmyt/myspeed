import React, {useContext, useEffect, useRef} from "react";
import "./styles.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowDown, faArrowUp, faCalendarDays, faCircleNodes, faClock, faClose, faFileExport,
    faGear, faGlobeEurope, faInfo, faKey, faPause, faPingPongPaddleBall, faPlay, faServer, faWandMagicSparkles
} from "@fortawesome/free-solid-svg-icons";
import {ConfigContext} from "@/common/contexts/Config";
import {StatusContext} from "@/common/contexts/Status";
import {DialogContext} from "@/common/contexts/Dialog";
import {SpeedtestContext} from "@/common/contexts/Speedtests";
import {downloadRequest, jsonRequest, patchRequest, postRequest} from "@/common/utils/RequestUtil";
import {creditsInfo, healthChecksInfo, recommendationsInfo} from "@/common/components/Dropdown/utils/infos";
import {exportOptions, languageOptions, selectOptions, timeOptions} from "@/common/components/Dropdown/utils/options";
import {parseCron, stringifyCron} from "@/common/components/Dropdown/utils/utils";
import {changeLanguage, t} from "i18next";

let icon;

export const isOpen = () => !document.getElementById("dropdown").classList.contains("dropdown-invisible");

export const toggleDropdown = (setIcon) => {
    if (setIcon) icon = setIcon;
    let classList = document.getElementById("dropdown").classList;
    if (classList.contains("dropdown-invisible")) {
        classList.remove("dropdown-invisible");
        icon(faClose);
    } else {
        classList.add("dropdown-invisible");
        icon(faGear);
    }
}

function DropdownComponent() {
    const [config, reloadConfig] = useContext(ConfigContext);
    const [status, updateStatus] = useContext(StatusContext);
    const updateTests = useContext(SpeedtestContext)[1];
    const [setDialog] = useContext(DialogContext);
    const ref = useRef();

    useEffect(() => {
        const onPress = event => {
            if (event.code === "Escape" && isOpen())
                toggleDropdown(icon);
        }
        document.addEventListener("keyup", onPress);
        return () => document.removeEventListener("keyup", onPress);
    }, []);

    useEffect(() => {
        const onClick = event => {
            let headerIcon = event.composedPath()[1].id || event.composedPath()[2].id;
            if (isOpen() && !ref.current.contains(event.target) && headerIcon !== "open-header")
                toggleDropdown(icon);
        }
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);

    const showFeedback = (customText, reload = true) => setDialog({
        title: "MySpeed", description: customText || t('dropdown.changes_applied'), buttonText: t('dialog.okay'),
        onSuccess: () => reload ? reloadConfig() : "", onClose: () => reloadConfig()
    });

    const patchDialog = async (key, dialog, toggle = true, postValue = (val) => val) => {
        if (toggle) toggleDropdown();

        setDialog({
            ...(await dialog(config[key])),
            onSuccess: value => patchRequest(`/config/${key}`, {value: postValue(value)})
                .then(res => showFeedback(!res.ok ? t("dropdown.changes_unsaved") : undefined))
        })
    }

    const updatePing = async () => patchDialog("ping", (value) => ({
        title: t("update.ping_title"), placeholder: t("update.ping_placeholder"), value
    }));

    const updateUpload = async () => patchDialog("upload", (value) => ({
        title: t("update.upload_title"), placeholder: t("update.upload_placeholder"), value
    }));

    const updateDownload = async () => patchDialog("download", (value) => ({
        title: t("update.download_title"), placeholder: t("update.download_placeholder"), value
    }));

    const recommendedSettings = async () => {
        toggleDropdown();
        const result = await jsonRequest("/recommendations");

        if (!result.message) {
            setDialog({
                title: t("update.recommendations_set"),
                description: recommendationsInfo(result.ping, result.download, result.upload),
                buttonText: t("dialog.apply"),
                onSuccess: async () => {
                    await patchRequest("/config/ping", {value: result.ping});
                    await patchRequest("/config/download", {value: result.download});
                    await patchRequest("/config/upload", {value: result.upload});
                    showFeedback();
                }
            });
        } else setDialog({title: t("dialog.recommendations_title"), description: recommendationsError, buttonText: t("dialog.okay")});
    }

    const updateServer = () => patchDialog("serverId", async (value) => ({
        title: t("update.server_title"),
        select: true,
        selectOptions: await jsonRequest("/info/server"),
        unsetButton: t("update.manually"),
        onClear: updateServerManually,
        value
    }));

    const updateServerManually = () => patchDialog("serverId", (value) => ({
        title: t("update.manual_server_title"), placeholder: t("update.manual_server_id"), type: "number", value: value,
    }), false);

    const updatePassword = async () => {
        toggleDropdown();
        setDialog({
            title: t("update.new_password"),
            placeholder: t("update.password_placeholder"),
            type: "password",
            unsetButton: localStorage.getItem("password") != null ? "Sperre aufheben" : undefined,
            onClear: () => patchRequest("/config/password", {value: "none"})
                .then(() => showFeedback(t("update.password_removed"), false))
                .then(() => localStorage.removeItem("password")),
            onSuccess: (value) => patchRequest("/config/password", {value})
                .then(() => showFeedback(undefined, false))
                .then(() => localStorage.setItem("password", value))
        })
    }

    const updateCron = async () => {
        toggleDropdown();
        setDialog({
            title: t("update.cron_title"),
            select: true,
            selectOptions: selectOptions(),
            value: config.cron,
            unsetButton: t("update.manually"),
            onClear: updateCronManually,
            onSuccess: value => patchRequest("/config/cron", {value}).then(() => showFeedback())
        });
    }

    const updateCronManually = () => patchDialog("cron", (value) => ({
        title: <>{t("update.cron_title")} <a href="https://crontab.guru/" target="_blank">?</a></>,
        placeholder: t("update.cron_rules"),
        value: value,
        updateDescription: (val) => <>{t("update.cron_next_test")} <span className="dialog-value">{parseCron(val)}</span></>,
        description: <>{t("update.cron_next_test")} <span className="dialog-value">{parseCron(value)}</span></>,
    }), false, (val) => stringifyCron(val));

    const updateTime = async () => {
        toggleDropdown();
        setDialog({
            title: t("update.time_title"),
            select: true,
            selectOptions: timeOptions(),
            value: localStorage.getItem("testTime") || 1,
            onSuccess: value => {
                localStorage.setItem("testTime", value);
                updateTests();
                showFeedback(undefined, false);
            }
        });
    }

    function exportDialog() {
        toggleDropdown();
        setDialog({
            select: true,
            title: t("update.export_title"),
            buttonText: t("update.download"),
            value: "json",
            selectOptions: exportOptions(),
            onSuccess: value => downloadRequest("/export/" + value)
        });
    }

    const togglePause = () => {
        toggleDropdown();
        if (!status.paused) {
            setDialog({
                title: t("update.pause_title"),
                placeholder: t("update.hours"),
                type: "number",
                buttonText: t("update.pause"),
                unsetButton: t("update.release_manually"),
                onClear: () => postRequest("/speedtests/pause", {resumeIn: -1}).then(updateStatus),
                onSuccess: (hours) => postRequest("/speedtests/pause", {resumeIn: hours}).then(updateStatus)
            });
        } else postRequest("/speedtests/continue").then(updateStatus);
    }

    const updateIntegration = async () => patchDialog("healthChecksUrl", (value) => ({
        title: <>{t("update.healthchecks")} <a onClick={showIntegrationInfo}>?</a></>,
        placeholder: t("update.healthchecks_url"), value,
        buttonText: t("dialog.update"),
        unsetButton: !value.includes("<uuid>") ? "Deaktivieren" : undefined,
        onClear: () => patchDialog("/config/healthChecksUrl", {value: "https://hc-ping.com/<uuid>"})
            .then(() => showFeedback(t("update.healthchecks_activated")))
    }));

    const showIntegrationInfo = () => setDialog({
        title: t("update.healthchecks"),
        description: healthChecksInfo(),
        buttonText: t("dialog.okay")
    });

    const updateLanguage = () => {
        toggleDropdown();
        setDialog({
            title: t("update.language"),
            select: true,
            selectOptions: languageOptions,
            value: localStorage.getItem("language") || "en",
            onSuccess: value => changeLanguage(value, showFeedback())
        });
    }

    const showCredits = () => {
        toggleDropdown();
        setDialog({title: "MySpeed", description: creditsInfo(), buttonText: t("dialog.close")});
    }

    const options = [
        {run: updatePing, icon: faPingPongPaddleBall, text: t("dropdown.ping")},
        {run: updateUpload, icon: faArrowUp, text: t("dropdown.upload")},
        {run: updateDownload, icon: faArrowDown, text: t("dropdown.download")},
        {run: recommendedSettings, icon: faWandMagicSparkles, text: t("dropdown.recommendations")},
        {hr: true, key: 1},
        {run: updateServer, icon: faServer, text: t("dropdown.server")},
        {run: updatePassword, icon: faKey, text: t("dropdown.password")},
        {run: updateCron, icon: faClock, text: t("dropdown.cron")},
        {run: updateTime, icon: faCalendarDays, text: t("dropdown.time")},
        {run: exportDialog, icon: faFileExport, text: t("dropdown.export")},
        {run: togglePause, icon: status.paused ? faPlay : faPause, text: t("dropdown." + (status.paused ? "resume_tests" : "pause_tests"))},
        {run: updateIntegration, icon: faCircleNodes, text: t("dropdown.healthchecks")},
        {run: updateLanguage, icon: faGlobeEurope, text: t("dropdown.language")},
        {run: showCredits, icon: faInfo, text: t("dropdown.info")}
    ];

    return (
        <div className="dropdown dropdown-invisible" id="dropdown" ref={ref}>
            <div className="dropdown-content">
                <h2>{t("dropdown.settings")}</h2>
                <div className="dropdown-entries">
                    {options.map(entry => !entry.hr ? (
                        <div className="dropdown-item" onClick={entry.run} key={entry.run}>
                            <FontAwesomeIcon icon={entry.icon}/>
                            <h3>{entry.text}</h3>
                        </div>
                    ) : <div className="center" key={entry.key}>
                        <hr className="dropdown-hr"/>
                    </div>)}
                </div>
            </div>
        </div>
    )
}

export default DropdownComponent;