import "./styles.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowDown,
    faArrowUp,
    faCircleNotch,
    faClock,
    faExclamationTriangle,
    faKey,
    faServer,
    faTableTennisPaddleBall
} from "@fortawesome/free-solid-svg-icons";
import React, {useContext, useEffect, useState} from "react";
import {NodeContext} from "@/common/contexts/Node";
import {InputDialogContext} from "@/common/contexts/InputDialog";
import {ToastNotificationContext} from "@/common/contexts/ToastNotification";
import {baseRequest} from "@/common/utils/RequestUtil";
import {t} from "i18next";
import {Trans} from "react-i18next";
import {getIconBySpeed} from "@/common/utils/TestUtil";
import {ConfigContext} from "@/common/contexts/Config";

export const NodeContainer = (node) => {
    const updateNodes = useContext(NodeContext)[1];
    const updateCurrentNode = useContext(NodeContext)[3];
    const reloadConfig = useContext(ConfigContext)[1];
    const updateToast = useContext(ToastNotificationContext);
    const [setDialog] = useContext(InputDialogContext);
    const [nodeData, setNodeData] = useState(null);
    const [nodeError, setNodeError] = useState(undefined);

    const prefix = node.currentNode ? "" : "/nodes/" + node.id;

    const updateData = async () => {
        const testRequest = await baseRequest(prefix + "/speedtests?limit=1");

        if (!testRequest.ok) return setNodeError("SERVER_NOT_REACHABLE");
        const tests = await testRequest.json();

        if (tests.length < 0) return setNodeError("SERVER_NOT_REACHABLE");

        const configRequest = await baseRequest(prefix + "/config");

        if (!configRequest.ok) return setNodeError("SERVER_NOT_REACHABLE");
        const config = await configRequest.json();

        if (config.viewMode) return setNodeError("PASSWORD_CHANGED");

        if (tests[0] === undefined) return setNodeData({pending: true});

        setNodeError(undefined);
        setNodeData({
            ping: tests[0]?.ping,
            download: Math.round(tests[0]?.download),
            upload: Math.round(tests[0]?.upload),
            pingIcon: getIconBySpeed(tests[0]?.ping, config.ping, false),
            downloadIcon: getIconBySpeed(tests[0]?.download, config.download, true),
            uploadIcon: getIconBySpeed(tests[0]?.upload, config.upload, true)
        });
    }

    const updatePassword = (wrong = false) => {
        setDialog({
            title: t("nodes.password_outdated"),
            type: "password",
            description: wrong ?
                <span className="icon-red">{t("dialog.password.wrong")}</span> : t("nodes.update_password"),
            placeholder: t("dialog.password.placeholder"),
            buttonText: t("dialog.update"),
            onSuccess: async (password) => {
                const res = await (await baseRequest(`/nodes/${node.id}/password`, "PATCH", {password: password})).json();

                if (res.type === "PASSWORD_UPDATED") {
                    updateData().catch(() => setNodeError("SERVER_NOT_REACHABLE"));
                    updateToast(t("nodes.password_updated"), "green", faKey);
                } else {
                    updatePassword(true);
                }
            }
        });
    }

    useEffect(() => {
        updateData().catch(() => setNodeError("SERVER_NOT_REACHABLE"));
        const interval = setInterval(() => updateData().catch(() => setNodeError("SERVER_NOT_REACHABLE")), 10000);
        return () => clearInterval(interval);
    }, []);

    const switchNode = () => {
        if (nodeError || !nodeData) {
            if (nodeError === "PASSWORD_CHANGED") updatePassword();
            return;
        }

        node.setShowNodePage(false);
        updateCurrentNode(node.id);
        reloadConfig();
    }

    const onContext = (event) => {
        event.preventDefault();

        if (node.currentNode) return;
        setDialog({
            title: t("nodes.delete.title"),
            description: <Trans components={{Bold: <span className="dialog-value"/>}}
                                values={node}>nodes.delete.description</Trans>,
            buttonText: t("nodes.delete.yes"),
            mainRed: true,
            onSuccess: () => baseRequest("/nodes/" + node.id, "DELETE").then(() => {
                updateToast(t("nodes.delete.success"), "green", faServer);
                updateNodes();
            })
        });
    }

    return (
        <div className={"node-item hover-" + (nodeError ? "red" : (nodeData ? "green" : "orange"))} key={node.id}
             onClick={switchNode} onContextMenu={onContext}>
            <div className="node-info-area">
                <FontAwesomeIcon icon={faServer}
                                 className={"icon-" + (nodeError ? "red" : (nodeData ? "green" : "orange"))}/>
                <div className="node-info">
                    <h1>{node.name}</h1>
                    <p>{node.url.replace(/(^\w+:|^)\/\//, '')}</p>
                </div>
            </div>
            <div className="speed-area">

                {nodeError === "SERVER_NOT_REACHABLE" && (<div className="icon-text">
                    <h2>{t("nodes.messages.not_reachable")}</h2>
                    <FontAwesomeIcon icon={faExclamationTriangle} className="speed-icon icon-red"/>
                </div>)}

                {nodeError === "PASSWORD_CHANGED" && (<div className="icon-text">
                    <h2>{t("nodes.messages.password_changed")}</h2>
                    <FontAwesomeIcon icon={faKey} className="speed-icon icon-red"/>
                </div>)}

                {!nodeError && !nodeData && (
                    <FontAwesomeIcon icon={faCircleNotch} className="speed-icon" spin={true}/>)}

                {nodeData && nodeData.pending && !nodeError && (<div className="icon-text">
                        <h2>{t("nodes.messages.tests_pending")}</h2>
                        <FontAwesomeIcon icon={faClock} className="speed-icon icon-blue"/>
                    </div>)}

                {nodeData && !nodeData.pending && !nodeError && (
                    <>
                        <div className="speed-item">
                            <FontAwesomeIcon icon={faTableTennisPaddleBall}
                                             className={"icon-" + nodeData.pingIcon}/>
                            <h1>{nodeData.ping} {t("latest.ping_unit")}</h1>
                        </div>

                        <div className="speed-item">
                            <FontAwesomeIcon icon={faArrowDown}
                                             className={"icon-" + nodeData.downloadIcon}/>
                            <h1>{nodeData.download} {t("latest.speed_unit")}</h1>
                        </div>

                        <div className="speed-item">
                            <FontAwesomeIcon icon={faArrowUp}
                                             className={"icon-" + nodeData.uploadIcon}/>
                            <h1>{nodeData.upload} {t("latest.speed_unit")}</h1>
                        </div>
                    </>
                )}
            </div>

        </div>
    );
}