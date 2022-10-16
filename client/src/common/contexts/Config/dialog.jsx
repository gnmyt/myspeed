import {patchRequest} from "@/common/utils/RequestUtil";

const OOKLA_ABOUT_URL = "https://www.speedtest.net/about";
const OOKLA_TERMS_URL = OOKLA_ABOUT_URL + "/terms";
const OOKLA_EULA_URL = OOKLA_ABOUT_URL + "/eula";
const OOKLA_PRIVACY_URL = OOKLA_ABOUT_URL + "/privacy";

export const passwordRequiredDialog = {
    title: "Passwort erforderlich",
    placeholder: "Dein Passwort",
    description: localStorage.getItem("password") ? <span className="icon-red">Das von dir eingegebene Passwort ist falsch</span> : "",
    type: "password",
    buttonText: "Fertig",
    onClose: () => window.location.reload(),
    onSuccess: (value) => {
        localStorage.setItem("password", value);
        window.location.reload();
    }
}

export const acceptDialog = {
    title: "Nutzungsbedingungen akzeptieren",
    description: <>Mit dem Klick auf <span className="dialog-value">Akzeptieren</span> bestätigst du, dass du die <a
        href={OOKLA_EULA_URL} target="_blank">EULA</a>, <a href={OOKLA_PRIVACY_URL}
                                                           target="_blank">Datenschutzerklärung</a> und <a
        href={OOKLA_TERMS_URL} target="_blank">Nutzungsbedingungen</a> von Ookla gelesen hast und diesen zustimmst.</>,
    buttonText: "Akzeptieren",
    disableCloseButton: true,
    onSuccess: () => patchRequest("/config/acceptOoklaLicense", {value: true})
}