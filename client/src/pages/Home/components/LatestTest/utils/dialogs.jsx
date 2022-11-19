import {t} from "i18next";
import {Trans} from "react-i18next";

export const downloadInfo = () => ({title: t("info.down.title"), description: t("info.down.description"), buttonText: t("dialog.okay")});

export const pingInfo = () => ({title: t("info.ping.title"), description: t("info.ping.description"), buttonText: t("dialog.okay")});

export const uploadInfo = () => ({title: t("info.up.title"), description: t("info.up.description"), buttonText: t("dialog.okay")});

export const latestTestInfo = (latest) => ({
    title: t("info.latest.title"),
    description: <Trans components={{Bold: <span className="dialog-value"/>}} values={{date: new Date(latest.created).toLocaleDateString(),
                            time: new Date(latest.created).toLocaleTimeString(undefined, {hour: "2-digit", minute: "2-digit"})}}>
        info.latest.description</Trans>,
    buttonText: t("dialog.okay")
});