import {DialogContext, DialogProvider} from "@/common/contexts/Dialog";
import React, {useContext, useState} from "react";
import "./styles.sass";
import {t} from "i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleInfo, faClose, faServer} from "@fortawesome/free-solid-svg-icons";
import {baseRequest} from "@/common/utils/RequestUtil";
import {ToastNotificationContext} from "@/common/contexts/ToastNotification";
import {InputDialogContext} from "@/common/contexts/InputDialog";
import {NodeContext} from "@/common/contexts/Node";

export const Dialog = () => {
    const close = useContext(DialogContext);

    const [invalidUrl, setInvalidUrl] = useState(false);

    const [nodes, updateNodes, currentNode, updateCurrentNode] = useContext(NodeContext);
    const [setDialog] = useContext(InputDialogContext);
    const updateToast = useContext(ToastNotificationContext);

    const [serverName, setServerName] = useState("");
    const [serverUrl, setServerUrl] = useState("");

    const runPasswordProcess = (wrong = false) => {
        setDialog({
            title: t("dialog.password.title"),
            type: "password",
            description: wrong ? <span className="icon-red">{t("dialog.password.wrong")}</span> : t("nodes.password_required"),
            placeholder: t("dialog.password.placeholder"),
            buttonText: t("nodes.create"),
            onSuccess: async (password) => {
                const res = await (await baseRequest("/nodes", "PUT", {
                    name: serverName, url: serverUrl,
                    password: password
                })).json();

                if (res.type === "PASSWORD_REQUIRED") {
                    runPasswordProcess(true);
                } else if (res.type === "NODE_CREATED") {
                    updateNodes();
                    updateToast(t("nodes.created"), "green", faServer);
                }
            }
        });
    }

    const validateNode = async () => {
        const response = await (await baseRequest("/nodes", "PUT", {
            name: serverName,
            url: serverUrl
        })).json();

        const type = await response.type;

        if (type === "INVALID_URL") {
            setInvalidUrl(true);
        } else if (type === "PASSWORD_REQUIRED") {
            close();
            runPasswordProcess();
        } else if (type === "NODE_CREATED") {
            updateNodes();
            close();
            updateToast(t("nodes.created"), "green", faServer);
        }
    }

    const createNode = () => {
        validateNode();
        console.log(serverName);
        console.log(serverUrl);
    }

    return (
        <>
            <div className="dialog-header">
                <h4 className="dialog-text">{t("nodes.add")}</h4>
                <FontAwesomeIcon icon={faClose} className="dialog-text dialog-icon" onClick={() => close()}/>
            </div>
            <div className="server-dialog">
                <div className="server-group">
                    <h2><FontAwesomeIcon icon={faCircleInfo}/> Servername</h2>
                    <input type="text" className="server-input" placeholder="MySpeed Instanz" value={serverName}
                           onChange={(event) => setServerName(event.target.value)}/>
                </div>
                <div className={"server-group" + (invalidUrl ? " server-error" : "")}>
                    <h2><FontAwesomeIcon icon={faServer}/> Serveradresse</h2>
                    <input type="text" className="server-input" placeholder="https://dein-server.de" value={serverUrl}
                           onChange={(event) => {
                               setServerUrl(event.target.value);
                               setInvalidUrl(false);
                           }}/>
                </div>
            </div>
            <div className="dialog-buttons">
                <button className="dialog-btn" onClick={createNode}>{t("nodes.create")}</button>
            </div>
        </>
    );

}

export const CreateNodeDialog = (props) => {
    return (
        <DialogProvider close={props.onClose}>
            <Dialog/>
        </DialogProvider>
    );
}