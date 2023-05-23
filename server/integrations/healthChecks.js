const axios = require("axios");

const sendPing = async (url, path, error, triggerActivity) => {
    if (url == null) return;
    if (path) url += "/" + path;

    await axios.post(url, error, {headers: {"user-agent": "MySpeed/HealthAgent"}})
        .then(() => triggerActivity())
        .catch(() => triggerActivity(true));
}

module.exports = (registerEvent) => {
    registerEvent('minutePassed', async (integration, data, triggerActivity) => {
        if (integration.data.url) await sendPing(integration.data.url, undefined, undefined, triggerActivity);
    });

    registerEvent('testFailed', async (integration, error, triggerActivity) => {
        if (integration.data.url) await sendPing(integration.data.url, "fail", error, triggerActivity);
    });

    registerEvent('testStarted', async (integration, data, triggerActivity) => {
        if (integration.data.url) await sendPing(integration.data.url, "start", data, triggerActivity);
    });

    registerEvent('testFinished', async (integration, data, triggerActivity) => {
        if (integration.data.url) await sendPing(integration.data.url, undefined, undefined, triggerActivity);
    });

    return {
        icon: "fa-solid fa-heart-pulse",
        fields: [
            {name: "url", type: "text", required: true},
        ]
    };
}