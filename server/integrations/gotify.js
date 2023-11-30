const axios = require("axios");
const {replaceVariables} = require("../util/helpers");

const defaults = {
    finished: "A speedtest is finished:\nPing: %ping% ms\nUpload: %upload% Mbps\nDownload: %download% Mbps",
    failed: "A speedtest has failed. Reason: %error%"
}

const postWebhook = async (url, key, triggerActivity, message, priority) => {
    axios.post(`${url}/message`, {message, priority}, {headers: {"Authorization": "Bearer " + key}})
        .then(() => triggerActivity())
        .catch(() => triggerActivity(true));
}

module.exports = (registerEvent) => {
    registerEvent('testFinished', async (integration, data, activity) => {
        if (integration.data.send_finished)
            await postWebhook(integration.data.url, integration.data.key, activity,
                replaceVariables(integration.data.finished_message || defaults.finished, data), 3);
    });

    registerEvent('testFailed', async (integration, error, activity) => {
        if (integration.data.send_failed)
            await postWebhook(integration.data.url, integration.data.key, activity,
                replaceVariables(integration.data.failed_message || defaults.failed, {error}), 8);
    });

    return {
        icon: "fa-solid fa-bell",
        fields: [
            {name: "url", type: "text", required: true, regex: /https?:\/\/.+/},
            {name: "key", type: "text", required: true, regex: /^.{15}$/},
            {name: "send_finished", type: "boolean", required: false},
            {name: "finished_message", type: "textarea", required: false},
            {name: "send_failed", type: "boolean", required: false},
            {name: "error_message", type: "textarea", required: false}
        ]
    };
}