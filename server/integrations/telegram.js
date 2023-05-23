const axios = require("axios");
const {replaceVariables} = require("../util/variables");

const defaults = {
    finished: "✨ *A speedtest is finished*\n🏓 `Ping`: %ping% ms\n🔼 `Upload`: %upload% Mbps\n🔽 `Download`: %download% Mbps",
    failed: "❌ *A speedtest has failed*\n`Reason`: %error%"
}

const postWebhook = async (token, chatId, message, triggerActivity) => {
    axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        text: message, chat_id: chatId, parse_mode: "markdown"
    })
        .then(() => triggerActivity())
        .catch(() => triggerActivity(true));
}

module.exports = (registerEvent) => {
    registerEvent('testFinished', async (integration, data, activity) => {
        if (integration.data.send_finished)
            await postWebhook(integration.data.token, integration.data.chat_id,
                replaceVariables(integration.data.finished_message || defaults.finished, data), activity)
    });

    registerEvent('testFailed', async (integration, error, activity) => {
        if (integration.data.send_failed)
            await postWebhook(integration.data.token, integration.data.chat_id,
                replaceVariables(integration.data.failed_message || defaults.failed, {error}), activity)
    });

    return {
        icon: "fa-brands fa-telegram",
        fields: [
            {name: "token", type: "text", required: true},
            {name: "chat_id", type: "text", required: true},
            {name: "send_finished", type: "boolean", required: false},
            {name: "finished_message", type: "textarea", required: false},
            {name: "send_failed", type: "boolean", required: false},
            {name: "error_message", type: "textarea", required: false}
        ]
    };
}