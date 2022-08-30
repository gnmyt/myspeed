import React, {useContext, useEffect} from "react";
import "./styles.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowDown,
    faArrowUp, faCalendarDays, faCircleNodes, faClock, faClose, faFileExport,
    faGear, faInfo,
    faKey,
    faPause,
    faPingPongPaddleBall,
    faPlay,
    faServer, faWandMagicSparkles
} from "@fortawesome/free-solid-svg-icons";
import {ConfigContext} from "@/common/contexts/Config";
import {StatusContext} from "@/common/contexts/Status";
import {DialogContext} from "@/common/contexts/Dialog";
import {SpeedtestContext} from "@/common/contexts/Speedtests";

let icon;

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

    let headers = localStorage.getItem("password") ? {password: localStorage.getItem("password")} : {};
    headers['content-type'] = 'application/json';

    useEffect(() => {
        const onPress = event => {
            if (event.code === "Escape" && !document.getElementById("dropdown").classList.contains("dropdown-invisible"))
                toggleDropdown(icon);
        }
        document.addEventListener("keyup", onPress);
        return () => document.removeEventListener("keyup", onPress);
    }, []);

    const showFeedback = (customText, reload = true) => setDialog({
        title: "MySpeed", description: customText || <>Deine Änderungen wurden übernommen.</>, buttonText: "Okay",
        onSuccess: () => reload ? reloadConfig() : "", onClose: () => reloadConfig()
    });

    const patchDialog = (key, dialog, toggle = true) => {
        if (toggle) toggleDropdown();

        setDialog({
            ...dialog(config[key]),
            onSuccess: value => {
                fetch("/api/config/" + key, {headers, method: "PATCH", body: JSON.stringify({value})})
                    .then(res => showFeedback(!res.ok ? "Deine Änderungen wurden nicht übernommen. Überprüfe deine Eingabe." : undefined));
            }
        })
    }

    const updatePing = async () => patchDialog("ping", (value) => ({
        title: "Optimalen Ping setzen (ms)", placeholder: "Ping (ms)", value
    }));

    const updateDownload = async () => patchDialog("download", (value) => ({
        title: "Optimalen Down-Speed setzen (Mbit/s)", placeholder: "Down-Speed (Mbit/s)", value
    }));

    const updateUpload = async () => patchDialog("upload", (value) => ({
        title: "Optimalen Up-Speed setzen (Mbit/s)", placeholder: "Up-Speed (Mbit/s)", value
    }));


    const updatePassword = async () => {
        toggleDropdown();
        setDialog({
            title: "Neues Passwort festlegen",
            placeholder: "Neues Passwort",
            type: "password",
            unsetButton: localStorage.getItem("password") != null,
            unsetButtonText: "Sperre aufheben",
            onClear: () => {
                fetch("/api/config/password", {headers: headers, method: "PATCH", body: JSON.stringify({value: "none"})})
                    .then(() => showFeedback(<>Die Passwortsperre wurde aufgehoben und das festgelegte Passwort wurde entfernt.</>, false));
                localStorage.removeItem("password");
            },
            onSuccess: value => {
                fetch("/api/config/password", {headers: headers, method: "PATCH", body: JSON.stringify({value: value})})
                    .then(() => showFeedback(undefined, false));
                localStorage.setItem("password", value);
            }
        })
    }

    const updateServer = () => {
        toggleDropdown();

        let servers = {};
        fetch("/api/info/server", {headers: headers})
            .then(res => res.json())
            .then(json => servers = json)
            .then(() => fetch("/api/config/serverId", {headers: headers}).then(res => res.json())
                .then(async server => setDialog({
                    title: "Speedtest-Server setzen",
                    select: true,
                    selectOptions: servers,
                    value: server.value,
                    unsetButton: true,
                    unsetButtonText: "Manuell festlegen",
                    onClear: () => updateServerManually(),
                    onSuccess: value => {
                        fetch("/api/config/serverId", {headers: headers, method: "PATCH", body: JSON.stringify({value: value})})
                            .then(() => showFeedback(undefined, false));
                    }
                })));
    }

    const updateServerManually = () => patchDialog("serverId", (value) => ({
        title: "Speedtest-Server setzen", placeholder: "Server-ID", type: "number", value: value,
    }), false);


    function togglePause() {
        toggleDropdown();
        if (!status.paused) {
            setDialog({
                title: "Speedtests pausieren für...",
                placeholder: "Stunden",
                type: "number",
                buttonText: "Pausieren",
                unsetButton: true,
                unsetButtonText: "Manuell freigeben",
                onClear: async () => {
                    fetch("/api/speedtests/pause", {headers: headers, method: "POST",
                        body: JSON.stringify({resumeIn: -1})}).then(() => updateStatus());
                },
                onSuccess: async hours => {
                    fetch("/api/speedtests/pause", {headers: headers, method: "POST",
                        body: JSON.stringify({resumeIn: hours})}).then(() => updateStatus());
                }
            });
        } else fetch("/api/speedtests/continue", {headers: headers, method: "POST"})
            .then(() => updateStatus());
    }

    const showCredits = () => {
        toggleDropdown();
        setDialog({
            title: "MySpeed",
            description: <><a href="https://github.com/gnmyt/myspeed" target="_blank" rel="noreferrer">MySpeed</a> wird
                von GNMYT bereitgestellt
                und verwendet die <a href="https://www.speedtest.net/apps/cli" target="_blank" rel="noreferrer">Speedtest-CLI</a> von Ookla.</>,
            buttonText: "Schließen"
        });
    }

    const recommendedSettings = async () => {
        toggleDropdown();
        fetch("/api/recommendations", {headers: headers}).then(res => res.json())
            .then(values => values.message !== undefined ? setDialog({
                title: "Automatische Empfehlungen",
                description: <>Du musst mindestens 10 Tests machen, damit ein Durchschnitt ermittelt werden kann. Ob die
                    Tests manuell oder automatisch durchgeführt wurden ist egal.
                </>,
                buttonText: "Okay"
            }) : setDialog({
                title: "Automatische Empfehlungen setzen?",
                description: <>Anhand der letzten 10 Testergebnisse wurde festgestellt, dass der optimale Ping bei <span
                    className="dialog-value">
                    {values.ping} ms</span>, der Download bei <span
                    className="dialog-value">{values.download} Mbit/s </span>
                    und der Upload bei <span className="dialog-value">{values.upload} Mbit/s</span> liegt. <br/>
                    Orientiere dich am besten an deinem Internetvertrag und übernehme es nur, wenn es mit dem
                    übereinstimmt.</>,
                buttonText: "Ja, übernehmen",
                onSuccess: async () => {
                    await fetch("/api/config/ping", {headers: headers, method: "PATCH", body: JSON.stringify({value: values.ping})});
                    await fetch("/api/config/download", {headers: headers, method: "PATCH", body: JSON.stringify({value: values.download})});
                    await fetch("/api/config/upload", {headers: headers, method: "PATCH", body: JSON.stringify({value: values.upload})});
                    showFeedback();
                }
            }));
    }

    function exportDialog() {
        toggleDropdown();
        setDialog({
            select: true,
            title: "Speedtests exportieren",
            buttonText: "Herunterladen",
            value: "json",
            selectOptions: {
                json: "JSON-Datei",
                csv: "CSV-Datei"
            },
            onSuccess: value => {
                fetch("/api/export/" + value, {headers: headers})
                    .then(async res => {
                        let element = document.createElement('a');
                        let url = res.headers.get('Content-Disposition').split('filename=')[1];
                        element.setAttribute("download", url.replaceAll("\"", ""));
                        res.blob().then(async blob => {
                            element.href = window.URL.createObjectURL(blob);
                            document.body.appendChild(element);
                            element.click();
                            element.remove();
                        });
                    });
            }
        });
    }

    const updateCronManually = () => patchDialog("cron", (value) => ({
        title: <>Test-Häufigkeit einstellen <a href="https://crontab.guru/" target="_blank">?</a></>, placeholder: "Cron-Regel", value: value,
    }), false);

    const updateCron = async () => {
        toggleDropdown();
        setDialog({
            title: "Test-Häufigkeit einstellen",
            select: true,
            selectOptions: {
                "* * * * *": "Durchgehend (jede Minute)",
                "0,30 * * * *": "Sehr häufig (alle 30 Minuten)",
                "0 * * * *": "Standard (jede Stunde)",
                "0 0,3,6,9,12,15,18,21 * * *": "Selten (alle 3 Stunden)",
                "0 0,6,12,18 * * *": "Sehr selten (alle 6 Stunden)"
            },
            value: config.cron,
            unsetButton: true,
            unsetButtonText: "Manuell festlegen",
            onClear: updateCronManually,
            onSuccess: value => {
                fetch("/api/config/cron", {headers: headers, method: "PATCH", body: JSON.stringify({value: value})})
                    .then(() => showFeedback());
            }
        });
    }

    const updateTime = async () => {
        toggleDropdown();
        setDialog({
            title: "Zeige Tests der letzten ...",
            select: true,
            selectOptions: {
                1: "24 Stunden (Standard)",
                2: "2 Tage (Insgesamt)",
                3: "7 Tage (Durchschnitt)",
                4: "30 Tage (Durchschnitt)"
            },
            value: localStorage.getItem("testTime") || 1,
            onSuccess: value => {
                localStorage.setItem("testTime", value);
                updateTests();
                showFeedback(undefined, false);
            }
        });
    }

    const showIntegrationInfo = () => setDialog({
        title: "HealthChecks Integration",
        description: <>MySpeed verwendet <a href="https://healthchecks.io/" target="_blank">Healthchecks</a>, um
            dich zu benachrichtigen, wenn dein Internet ausfällt. Um dies zu aktivieren, setze deine Ping URL in das
            Textfeld ein. Mehr dazu <a href="https://myspeed.gnmyt.dev/instructions/settings/" target="_blank">hier</a></>,
        buttonText: "Okay"
    });

    const updateIntegration = async () => patchDialog("healthChecksUrl", (value) => ({
        title: <>HealthChecks Integration <a onClick={showIntegrationInfo}>?</a></>,
        placeholder: "HealthChecks Server URL", value,
        buttonText: "Aktualisieren",
        unsetButton: !value.includes("<uuid>"),
        unsetButtonText: "Deaktivieren",
        onClear: () => fetch("/api/config/healthChecksUrl", {headers: headers, method: "PATCH",
            body: JSON.stringify({value: "https://hc-ping.com/<uuid>"})
        }).then(() => showFeedback(<>Die Healthchecks wurden deaktiviert</>))
    }));

    return (
        <div className="dropdown dropdown-invisible" id="dropdown">
            <div className="dropdown-content">
                <h2>Einstellungen</h2>
                <div className="dropdown-entries">
                    <div className="dropdown-item" onClick={updatePing}>
                        <FontAwesomeIcon icon={faPingPongPaddleBall}/>
                        <h3>Optimaler Ping</h3>
                    </div>
                    <div className="dropdown-item" onClick={updateUpload}>
                        <FontAwesomeIcon icon={faArrowUp}/>
                        <h3>Optimaler Up-Speed</h3>
                    </div>
                    <div className="dropdown-item" onClick={updateDownload}>
                        <FontAwesomeIcon icon={faArrowDown}/>
                        <h3>Optimaler Down-Speed</h3>
                    </div>
                    <div className="dropdown-item" onClick={recommendedSettings}>
                        <FontAwesomeIcon icon={faWandMagicSparkles}/>
                        <h3>Optimale Werte</h3>
                    </div>
                    <div className="center">
                        <hr className="dropdown-hr"/>
                    </div>
                    <div className="dropdown-item" onClick={updateServer}>
                        <FontAwesomeIcon icon={faServer}/>
                        <h3>Server wechseln</h3>
                    </div>
                    <div className="dropdown-item" onClick={updatePassword}>
                        <FontAwesomeIcon icon={faKey}/>
                        <h3>Passwort ändern</h3>
                    </div>
                    <div className="dropdown-item" onClick={updateCron}>
                        <FontAwesomeIcon icon={faClock}/>
                        <h3>Häufigkeit einstellen</h3>
                    </div>
                    <div className="dropdown-item" onClick={updateTime}>
                        <FontAwesomeIcon icon={faCalendarDays} />
                        <h3>Zeitraum festlegen</h3>
                    </div>
                    <div className="dropdown-item" onClick={exportDialog}>
                        <FontAwesomeIcon icon={faFileExport}/>
                        <h3>Tests exportieren</h3>
                    </div>
                    <div className="dropdown-item" onClick={togglePause}>
                        <FontAwesomeIcon icon={status.paused ? faPlay : faPause}/>
                        <h3>{status.paused ? "Speedtests fortsetzen" : "Speedtests pausieren"}</h3>
                    </div>
                    <div className="dropdown-item" onClick={updateIntegration}>
                        <FontAwesomeIcon icon={faCircleNodes} />
                        <h3>Healthchecks</h3>
                    </div>
                    <div className="dropdown-item" onClick={showCredits}>
                        <FontAwesomeIcon icon={faInfo}/>
                        <h3>Info</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DropdownComponent;
