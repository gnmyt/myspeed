const axios = require("axios");

const postWebhook = async (url, event, data, triggerActivity) => {
    axios.post(url, {event, data}, {headers: {"user-agent": "MySpeed/WebhookAgent"}})
        .then(() => triggerActivity())
        .catch(() => triggerActivity(true));
}

module.exports = (registerEvent) => {
    registerEvent('testStarted', async (integration, data, activity) => {
        if (integration.data.send_started) await postWebhook(integration.data.url, "TEST_STARTED", undefined, activity);
    });

    registerEvent('minutePassed', async (integration, data, activity) => {
        if (integration.data.send_alive) await postWebhook(integration.data.url, "KEEP_ALIVE", undefined, activity);
    });

    registerEvent('testFinished', async (integration, data, activity) => {
        if (integration.data.send_finished) await postWebhook(integration.data.url, "TEST_FINISHED", data, activity);
    });

    registerEvent('testFailed', async (integration, error, activity) => {
        if (integration.data.send_failed) await postWebhook(integration.data.url, "TEST_FAILED", {error}, activity);
    });

    return {
        icon: "fa-solid fa-globe",
        fields: [
            {name: "url", type: "text", required: true},
            {name: "send_started", type: "boolean", required: false},
            {name: "send_finished", type: "boolean", required: false},
            {name: "send_alive", type: "boolean", required: false},
            {name: "send_failed", type: "boolean", required: false}
        ]
    };
}