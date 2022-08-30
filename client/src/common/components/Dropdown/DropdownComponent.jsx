import React, {useContext, useEffect, useRef} from "react";
import "./styles.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowDown, faArrowUp, faCalendarDays, faCircleNodes, faClock, faClose, faFileExport,
    faGear, faInfo, faKey, faPause, faPingPongPaddleBall, faPlay, faServer, faWandMagicSparkles
} from "@fortawesome/free-solid-svg-icons";
import {ConfigContext} from "@/common/contexts/Config";
import {StatusContext} from "@/common/contexts/Status";
import {DialogContext} from "@/common/contexts/Dialog";
import {SpeedtestContext} from "@/common/contexts/Speedtests";
import {downloadRequest, jsonRequest, patchRequest, postRequest} from "@/common/utils/RequestUtil";
import {creditsInfo, healthChecksInfo, recommendationsError, recommendationsInfo} from "@/common/components/Dropdown/utils/infos";
import {exportOptions, selectOptions, timeOptions} from "@/common/components/Dropdown/utils/options";
import {parseCron, stringifyCron} from "@/common/components/Dropdown/utils/utils";

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
        title: "MySpeed", description: customText || <>Deine Änderungen wurden übernommen.</>, buttonText: "Okay",
        onSuccess: () => reload ? reloadConfig() : "", onClose: () => reloadConfig()
    });

    const patchDialog = async (key, dialog, toggle = true, postValue = (val) => val) => {
        if (toggle) toggleDropdown();

        setDialog({
            ...(await dialog(config[key])),
            onSuccess: value => patchRequest(`/config/${key}`, {value: postValue(value)})
                .then(res => showFeedback(!res.ok ? "Deine Änderungen wurden nicht übernommen. Überprüfe deine Eingabe." : undefined))
        })
    }

    const updatePing = async () => patchDialog("ping", (value) => ({
        title: "Optimalen Ping setzen (ms)", placeholder: "Ping (ms)", value
    }));

    const updateUpload = async () => patchDialog("upload", (value) => ({
        title: "Optimalen Up-Speed setzen (Mbit/s)", placeholder: "Up-Speed (Mbit/s)", value
    }));

    const updateDownload = async () => patchDialog("download", (value) => ({
        title: "Optimalen Down-Speed setzen (Mbit/s)", placeholder: "Down-Speed (Mbit/s)", value
    }));

    const recommendedSettings = async () => {
        toggleDropdown();
        const result = await jsonRequest("/recommendations");

        if (!result.message) {
            setDialog({
                title: "Automatische Empfehlungen setzen?",
                description: recommendationsInfo(result.ping, result.download, result.upload),
                buttonText: "Ja, übernehmen",
                onSuccess: async () => {
                    await patchRequest("/config/ping", {value: result.ping});
                    await patchRequest("/config/download", {value: result.download});
                    await patchRequest("/config/upload", {value: result.upload});
                    showFeedback();
                }
            });
        } else setDialog({title: "Automatische Empfehlungen", description: recommendationsError, buttonText: "Okay"});
    }

    const updateServer = () => patchDialog("serverId", async (value) => ({
        title: "Speedtest-Server setzen",
        select: true,
        selectOptions: await jsonRequest("/info/server"),
        unsetButton: "Manuell festlegen",
        onClear: updateServerManually,
        value
    }));

    const updateServerManually = () => patchDialog("serverId", (value) => ({
        title: "Speedtest-Server setzen", placeholder: "Server-ID", type: "number", value: value,
    }), false);

    const updatePassword = async () => {
        toggleDropdown();
        setDialog({
            title: "Neues Passwort festlegen",
            placeholder: "Neues Passwort",
            type: "password",
            unsetButton: localStorage.getItem("password") != null ? "Sperre aufheben" : undefined,
            onClear: () => patchRequest("/config/password", {value: "none"})
                .then(() => showFeedback(<>Die Passwortsperre wurde aufgehoben und das festgelegte Passwort wurde
                    entfernt.</>, false))
                .then(() => localStorage.removeItem("password")),
            onSuccess: (value) => patchRequest("/config/password", {value})
                .then(() => showFeedback(undefined, false))
                .then(() => localStorage.setItem("password", value))
        })
    }

    const updateCron = async () => {
        toggleDropdown();
        setDialog({
            title: "Test-Häufigkeit einstellen",
            select: true,
            selectOptions: selectOptions,
            value: config.cron,
            unsetButton: "Manuell festlegen",
            onClear: updateCronManually,
            onSuccess: value => patchRequest("/config/cron", {value}).then(() => showFeedback())
        });
    }

    const updateCronManually = () => patchDialog("cron", (value) => ({
        title: <>Test-Häufigkeit einstellen <a href="https://crontab.guru/" target="_blank">?</a></>,
        placeholder: "Cron-Regel",
        value: value,
        updateDescription: (val) => <>Nächster Test: <span className="dialog-value">{parseCron(val)}</span></>,
        description: <>Nächster Test: <span className="dialog-value">{parseCron(value)}</span></>,
    }), false, (val) => stringifyCron(val));

    const updateTime = async () => {
        toggleDropdown();
        setDialog({
            title: "Zeige Tests der letzten ...",
            select: true,
            selectOptions: timeOptions,
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
            title: "Speedtests exportieren",
            buttonText: "Herunterladen",
            value: "json",
            selectOptions: exportOptions,
            onSuccess: value => downloadRequest("/export/" + value)
        });
    }

    const togglePause = () => {
        toggleDropdown();
        if (!status.paused) {
            setDialog({
                title: "Speedtests pausieren für...",
                placeholder: "Stunden",
                type: "number",
                buttonText: "Pausieren",
                unsetButton: "Manuell freigeben",
                onClear: () => postRequest("/speedtests/pause", {resumeIn: -1}).then(updateStatus),
                onSuccess: (hours) => postRequest("/speedtests/pause", {resumeIn: hours}).then(updateStatus)
            });
        } else postRequest("/speedtests/continue").then(updateStatus);
    }

    const updateIntegration = async () => patchDialog("healthChecksUrl", (value) => ({
        title: <>HealthChecks Integration <a onClick={showIntegrationInfo}>?</a></>,
        placeholder: "HealthChecks Server URL", value,
        buttonText: "Aktualisieren",
        unsetButton: !value.includes("<uuid>") ? "Deaktivieren" : undefined,
        onClear: () => patchDialog("/config/healthChecksUrl", {value: "https://hc-ping.com/<uuid>"})
            .then(() => showFeedback(<>Die Healthchecks wurden deaktiviert</>))
    }));

    const showIntegrationInfo = () => setDialog({
        title: "HealthChecks Integration",
        description: healthChecksInfo,
        buttonText: "Okay"
    });

    const showCredits = () => {
        toggleDropdown();
        setDialog({title: "MySpeed", description: creditsInfo, buttonText: "Schließen"});
    }

    const options = [
        {run: updatePing, icon: faPingPongPaddleBall, text: "Optimaler Ping"},
        {run: updateUpload, icon: faArrowUp, text: "Optimaler Up-Speed"},
        {run: updateDownload, icon: faArrowDown, text: "Optimaler Down-Speed"},
        {run: recommendedSettings, icon: faWandMagicSparkles, text: "Optimale Werte"},
        {hr: true, key: 1},
        {run: updateServer, icon: faServer, text: "Server wechseln"},
        {run: updatePassword, icon: faKey, text: "Passwort ändern"},
        {run: updateCron, icon: faClock, text: "Häufigkeit einstellen"},
        {run: updateTime, icon: faCalendarDays, text: "Zeitraum festlegen"},
        {run: exportDialog, icon: faFileExport, text: "Tests exportieren"},
        {run: togglePause, icon: status.paused ? faPlay : faPause, text: "Tests " + (status.paused ? "fortsetzen" : "pausieren")},
        {run: updateIntegration, icon: faCircleNodes, text: "Healthchecks"},
        {run: showCredits, icon: faInfo, text: "Info"}
    ];

    return (
        <div className="dropdown dropdown-invisible" id="dropdown" ref={ref}>
            <div className="dropdown-content">
                <h2>Einstellungen</h2>
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