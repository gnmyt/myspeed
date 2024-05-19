const axios = require("axios");
const {replaceVariables} = require("../util/helpers");

const BASE_URL = "https://api.pushover.net/1";

const defaults = {
    finished: "A speedtest is finished:\nPing: %ping% ms\nUpload: %upload% Mbps\nDownload: %download% Mbps",
    failed: "A speedtest has failed. Reason: %error%"
}

module.exports = (registerEvent) => {
    registerEvent('testFinished', async (integration, data, triggerActivity) => {
        if (!integration.data.send_finished) return;

        const message = replaceVariables(integration.data.finished_message || defaults.finished, data);

        axios.post(`${BASE_URL}/messages.json`, {
            token: integration.data.token,
            user: integration.data.user_key, message
        }).then(() => triggerActivity())
            .catch(() => triggerActivity(true));
    });

    registerEvent('testFailed', async (integration, error, triggerActivity) => {
        if (!integration.data.send_failed) return;

        const message = replaceVariables(integration.data.error_message || defaults.failed, {error});

        axios.post(`${BASE_URL}/messages.json`, {
            token: integration.data.token,
            user: integration.data.user_key, message
        }).then(() => triggerActivity())
            .catch(() => triggerActivity(true));
    });

    return {
        icon: "fa-solid fa-pushover",
        fields: [
            {name: "token", type: "text", required: true, regex: /^[a-z0-9]{30}$/},
            {name: "user_key", type: "text", required: true, regex: /^[a-z0-9]{30}$/},
            {name: "send_finished", type: "boolean", required: false},
            {name: "finished_message", type: "textarea", required: false},
            {name: "send_failed", type: "boolean", required: false},
            {name: "error_message", type: "textarea", required: false}
        ]
    };
}