import {patchRequest} from "@/common/utils/RequestUtil";
import {t} from "i18next";
import {Trans} from "react-i18next";

const OOKLA_ABOUT_URL = "https://www.speedtest.net/about";
const OOKLA_TERMS_URL = OOKLA_ABOUT_URL + "/terms";
const OOKLA_EULA_URL = OOKLA_ABOUT_URL + "/eula";
const OOKLA_PRIVACY_URL = OOKLA_ABOUT_URL + "/privacy";

export const passwordRequiredDialog = () => ({
    title: t("dialog.password.title"),
    placeholder: t("dialog.password.placeholder"),
    description: localStorage.getItem("password") ? <span className="icon-red">{t("dialog.password.wrong")}</span> : "",
    type: "password",
    buttonText: t("dialog.done"),
    disableCloseButton: true,
    onSuccess: (value) => {
        localStorage.setItem("password", value);
        window.location.reload();
    }
});

export const apiErrorDialog = () => ({
    title: t("dialog.api.title"),
    description: <span className="icon-red">{t("dialog.api.description")}</span>,
    buttonText: t("dialog.retry"),
    disableCloseButton: true,
    onSuccess: () => window.location.reload()
});

export const acceptDialog = () => ({
    title: t("dialog.accept.title"),
    description: <Trans components={{Bold: <span className="dialog-value"/>, EULA: <a href={OOKLA_EULA_URL} target="_blank"/>,
        Privacy: <a href={OOKLA_PRIVACY_URL} target="_blank"/>, Terms: <a href={OOKLA_TERMS_URL} target="_blank"/> }}>dialog.accept.description</Trans>,
    buttonText: t("dialog.accept.button"),
    disableCloseButton: true,
    onSuccess: () => patchRequest("/config/acceptOoklaLicense", {value: true})
});