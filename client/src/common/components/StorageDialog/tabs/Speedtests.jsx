import React, {useContext, useState} from "react";
import {DialogContext} from "@/common/contexts/Dialog";
import {deleteRequest, downloadRequest, putRequest} from "@/common/utils/RequestUtil";
import {SpeedtestContext} from "@/common/contexts/Speedtests";
import {ToastNotificationContext} from "@/common/contexts/ToastNotification";
import {t} from "i18next";
import {faFileExport, faFileImport, faTrashCan} from "@fortawesome/free-solid-svg-icons";

export default ({tests}) => {
    const close = useContext(DialogContext);
    const [deleteWarning, setDeleteWarning] = useState(false);
    const updateTests = useContext(SpeedtestContext)[1];
    const updateToast = useContext(ToastNotificationContext);

    const deleteHistory = () => {
        if (!deleteWarning) {
            setDeleteWarning(true);
            return;
        }

        deleteRequest("/storage/tests/history").then(() => {
            setDeleteWarning(false);
            updateTests();
            updateToast(t("storage.history_cleared"), "green", faTrashCan);
            close();
        });
    }

    const downloadHistory = (type) => {
        downloadRequest(`/storage/tests/history/${type}`).then(() => {
            updateToast(t("storage.tests_exported"), "green", faFileExport);
            close();
        });
    }

    const importHistory = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";

        input.onchange = () => {
            const file = input.files[0];
            const reader = new FileReader();
            reader.readAsText(file);

            reader.onload = () => {
                const data = JSON.parse(reader.result);
                putRequest("/storage/tests/history", data).then((res) => {
                    if (res.ok) {
                        updateToast(t("storage.tests_imported"), "green", faFileImport);
                        updateTests();
                    } else {
                        updateToast(t("storage.import_error"), "red");
                    }
                    close();
                });
            }
            input.remove();
        }

        input.click();
    }


    return (
        <>
            <div className="storage-row">
                <h3>{t("storage.stored_tests")}</h3>
                <h3>{tests} {t("storage.tests")}</h3>
            </div>

            <div className="storage-row">
                <h3>{t("storage.export_tests")}</h3>
                <div>
                    <button className="dialog-btn" onClick={() => downloadHistory("csv")}>
                        {t("storage.csv")}</button>
                    <button className="dialog-btn" onClick={() => downloadHistory("json")}>
                        {t("storage.json")}</button>
                </div>
            </div>

            <div className="storage-row">
                <h3>{t("storage.import_tests")}</h3>
                <button className="dialog-btn" onClick={importHistory}>{t("storage.import")}</button>
            </div>

            <div className="storage-row">
                <h3>{t("storage.clear_history")}</h3>
                <button className="dialog-btn dialog-secondary" onClick={deleteHistory}>
                    {deleteWarning ? t("storage.confirm_delete") : t("storage.delete")}</button>
            </div>

        </>
    )
}