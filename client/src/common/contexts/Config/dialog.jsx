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