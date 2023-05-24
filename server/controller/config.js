const config = require("../models/Config");
const {triggerEvent} = require("./integrations");

const configDefaults = {
    "ping": "25",
    "download": "100",
    "upload": "50",
    "cron": "0 * * * *",
    "serverId": "none",
    "password": "none",
    "passwordLevel": "none",
    "acceptOoklaLicense": "false",
    "healthChecksUrl": "https://hc-ping.com/<uuid>"
}

module.exports.insertDefaults = async () => {
    let insert = [];
    for (let key in configDefaults) {
        if (!(await config.findOne({where: {key: key}})))
            insert.push({key: key, value: configDefaults[key]});
    }

    await config.bulkCreate(insert, {validate: true});
}

// Lists all config entries
module.exports.list = async () => {
    return await config.findAll();
}

// Gets a specific config entry
module.exports.get = async (key) => {
    return await config.findByPk(key);
}

// Updates a specific config entry
module.exports.update = async (key, newValue) => {
    if ((await this.get(key)) === undefined) return undefined;

    triggerEvent("configUpdated", {key: key, value: key === "password" ? "protected" :newValue}).then(() => {});

    return await config.update({value: newValue}, {where: {key: key}});
}

// Resets a specific config entry to the default value
module.exports.resetDefault = async (key) => {
    await this.update(key, configDefaults[key]);
}