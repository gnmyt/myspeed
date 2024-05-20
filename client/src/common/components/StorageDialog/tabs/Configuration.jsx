import React, {useContext, useState} from "react";
import {deleteRequest, downloadRequest, putRequest} from "@/common/utils/RequestUtil";
import {DialogContext} from "@/common/contexts/Dialog";
import {ToastNotificationContext} from "@/common/contexts/ToastNotification";
import {ConfigContext} from "@/common/contexts/Config";
import {t} from "i18next";
import {faClockRotateLeft, faFileExport, faFileImport} from "@fortawesome/free-solid-svg-icons";

export default () => {
    const close = useContext(DialogContext);
    const [deleteWarning, setDeleteWarning] = useState(false);
    const updateConfig = useContext(ConfigContext)[1];
    const updateToast = useContext(ToastNotificationContext);

    const exportConfig = () => {
        downloadRequest("/storage/config").then(() => {
            updateToast(t("storage.settings_exported"), "green", faFileExport);
            close();
        });
    }

    const importConfig = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";

        input.onchange = () => {
            const file = input.files[0];
            const reader = new FileReader();
            reader.readAsText(file);

            reader.onload = () => {
                const data = JSON.parse(reader.result);
                putRequest("/storage/config", data).then((res) => {
                    if (res.ok) {
                        updateToast(t("storage.settings_imported"), "green", faFileImport);
                        updateConfig();
                        close();
                    } else {
                        updateToast(t("storage.import_error"), "red");
                    }
                });
            }
            input.remove();
        }

        input.click();
    }

    const factoryReset = () => {
        if (!deleteWarning) {
            setDeleteWarning(true);
            return;
        }

        deleteRequest("/storage/config").then(() => {
            setDeleteWarning(false);
            updateToast(t("storage.factory_reset_completed"), "green", faClockRotateLeft);
            updateConfig();
            close();
        });
    }

    return (
        <>
            <div className="storage-row">
                <h3>{t("storage.export_settings")}</h3>
                <button className="dialog-btn" onClick={exportConfig}>{t("storage.export")}</button>
            </div>

            <div className="storage-row">
                <h3>{t("storage.import_settings")}</h3>
                <button className="dialog-btn" onClick={importConfig}>{t("storage.import")}</button>
            </div>

            <div className="storage-row">
                <h3>{t("storage.factory_reset")}</h3>
                <button className="dialog-btn dialog-secondary" onClick={factoryReset}>
                    {deleteWarning ? t("storage.confirm_reset") : t("storage.reset")}</button>
            </div>
        </>
    )
}