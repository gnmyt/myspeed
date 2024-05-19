import {t} from "i18next";

export const passwordRequiredDialog = () => ({
    title: t("dialog.password.title"),
    placeholder: t("dialog.password.placeholder"),
    description: localStorage.getItem("password") ? <span className="icon-red">{t("dialog.password.wrong")}</span> : "",
    type: "password",
    buttonText: t("dialog.login"),
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