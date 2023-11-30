const axios = require("axios");
const {replaceVariables} = require("../util/helpers");

const defaults = {
    finished: ":sparkles: **A speedtest is finished**\n > :ping_pong: `Ping`: %ping% ms\n > :arrow_up: `Upload`: %upload% Mbps\n > :arrow_down: `Download`: %download% Mbps",
    failed: ":x: **A speedtest has failed**\n > `Reason`: %error%"
}

const postWebhook = async (url, username, color, message, triggerActivity) => {
    axios.post(url, {
        content: null, username,
        embeds: [{description: message, color, footer: {text: "MySpeed"}, timestamp: new Date().toISOString()}],
    })
        .then(() => triggerActivity())
        .catch(() => triggerActivity(true));
}

module.exports = (registerEvent) => {
    registerEvent('testFinished', async (integration, data, activity) => {
        if (integration.data.send_finished)
            await postWebhook(integration.data.url, integration.data.display_name || "MySpeed", 4572762,
                replaceVariables(integration.data.finished_message || defaults.finished, data), activity)
    });

    registerEvent('testFailed', async (integration, error, activity) => {
        if (integration.data.send_failed)
            await postWebhook(integration.data.url, integration.data.display_name || "MySpeed", 12993861,
                replaceVariables(integration.data.failed_message || defaults.failed, {error}), activity)
    });

    return {
        icon: "fa-brands fa-discord",
        fields: [
            {name: "url", type: "text", required: true, regex: /https:\/\/.*discord.com\/api\/webhooks\/\d+\/.+/},
            {name: "display_name", type: "text", required: false},
            {name: "send_finished", type: "boolean", required: false},
            {name: "finished_message", type: "textarea", required: false},
            {name: "send_failed", type: "boolean", required: false},
            {name: "error_message", type: "textarea", required: false}
        ]
    };
}