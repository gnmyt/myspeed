import "./styles.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowDown,
    faArrowUp,
    faCircleNotch, faClock,
    faExclamationTriangle,
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

export const NodeContainer = (node) => {
    const [nodes, updateNodes, currentNode, updateCurrentNode] = useContext(NodeContext);
    const updateToast = useContext(ToastNotificationContext);
    const [setDialog] = useContext(InputDialogContext);
    const [nodeData, setNodeData] = useState(null);
    const [nodeError, setNodeError] = useState(false);

    const prefix = node.currentNode ? "" : "/nodes/" + node.id;

    const updateData = async () => {
        if (nodeData) return;
        const testRequest = await baseRequest(prefix + "/speedtests?limit=1");

        if (!testRequest.ok) return setNodeError(true);
        const tests = await testRequest.json();

        if (tests.length < 0) return setNodeError(true);

        const configRequest = await baseRequest(prefix + "/config");

        if (!configRequest.ok) return setNodeError(true);
        const config = await configRequest.json();

        if (config.viewMode) return setNodeError(true);

        if (tests[0] === undefined) return setNodeData({failed: true});

        setNodeData({
            ping: tests[0]?.ping,
            download: Math.round(tests[0]?.download),
            upload: Math.round(tests[0]?.upload),
            pingIcon: getIconBySpeed(tests[0]?.ping, config.ping, false),
            downloadIcon: getIconBySpeed(tests[0]?.download, config.download, true),
            uploadIcon: getIconBySpeed(tests[0]?.upload, config.upload, true)
        });
    }

    useEffect(() => {
        updateData();
    }, []);

    const switchNode = () => {
        if (nodeError || !nodeData) return;

        node.setShowNodePage(false);
        updateCurrentNode(node.id);
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

                {nodeError && (<><FontAwesomeIcon icon={faExclamationTriangle} className="speed-icon icon-red"/></>)}

                {!nodeError && !nodeData && (
                    <FontAwesomeIcon icon={faCircleNotch} className="speed-icon" spin={true}/>)}

                {nodeData && nodeData.failed && (
                    <FontAwesomeIcon icon={faClock} className="speed-icon icon-blue"/>)}

                {nodeData && !nodeData.failed && (
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