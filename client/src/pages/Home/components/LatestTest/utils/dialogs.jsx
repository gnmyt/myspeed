export const downloadInfo = {
    title: "Download-Geschwindigkeit",
    description: "Die Downloadgeschwindigkeit wirkt sich auf dein Surferlebnis aus. Umso mehr du bekommst, desto schneller kann dein Computer Daten empfangen.",
    buttonText: "Okay"
};

export const pingInfo = {
    title: "Ping",
    description: "Der Ping zeigt dir, wie schnell der jeweilige Anbieter antwortet. Umso kürzer die Zeit, desto besser.",
    buttonText: "Okay"
}

export const uploadInfo = {
    title: "Upload-Geschwindigkeit",
    description: "Die Uploadgeschwindigkeit wirkt sich auf dein Surferlebnis aus. Umso mehr du bekommst, desto schneller kann dein Computer Daten senden.",
    buttonText: "Okay"
}

export const latestTestInfo = (latest) => ({
    title: "Letzter Test",
    description: <>Dies ist die Zeit, die dir zeigt, wann der letzte Test ausgeführt wurde. In
        diesem Fall wurde der letzte Test am <span
            className="dialog-value">{new Date(latest.created).toLocaleDateString("de-DE")}</span> um <span
            className="dialog-value">{new Date(latest.created).toLocaleTimeString("de-DE", {
            hour: "2-digit", minute: "2-digit"
        })}</span> ausgeführt.</>,
    buttonText: "Okay"
});