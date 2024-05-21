const config = require("../models/Config");
const node = require("../models/Node");
const test = require("../models/Speedtests");
const recommendations = require("../models/Recommendations");
const integration = require("../models/IntegrationData");
const {triggerEvent} = require("./integrations");
const bcrypt = require('bcrypt');
const timer = require('../tasks/timer');
const cron = require('cron-validator');
const db = require("../config/database");
const fs = require('fs');
const path = require('path');
const interfaces = require('../util/loadInterfaces');

const configDefaults = {
    ping: "25",
    download: "100",
    upload: "50",
    cron: "0 * * * *",
    provider: "none",
    ooklaId: "none",
    libreId: "none",
    password: "none",
    passwordLevel: "none",
    interface: "none"
}

module.exports.insertDefaults = async () => {
    let insert = [];
    for (let key in configDefaults) {
        if (key !== "interface" && !(await config.findOne({where: {key: key}})))
            insert.push({key: key, value: configDefaults[key]});

        if (key === "interface") {
            const ips = Object.keys(interfaces.interfaces);
            let ip = ips.length > 0 ? ips[0] : "none";

            if (!(await config.findOne({where: {key: key}})))
                insert.push({key: key, value: ip});
        }
    }

    await config.bulkCreate(insert, {validate: true});
}

module.exports.listAll = async () => {
    return await config.findAll();
}

module.exports.getValue = async (key) => {
    return (await config.findByPk(key))?.value;
}

module.exports.updateValue = async (key, newValue) => {
    if ((await this.getValue(key)) === undefined) return undefined;

    triggerEvent("configUpdated", {key: key, value: key === "password" ? "protected" : newValue})
        .then(undefined);

    return await config.update({value: newValue}, {where: {key: key}});
}

module.exports.getUsedStorage = async () => {
    let size = 0;

    if (process.env.DB_TYPE === "mysql") {
        const sizes = await db.query("SELECT table_name AS `Table`, ROUND((data_length + index_length), 2) AS `size` FROM information_schema.TABLES WHERE table_schema = ?;", {
            replacements: [process.env.DB_NAME],
            type: db.QueryTypes.SELECT
        });
        for (let i = 0; i < sizes.length; i++) {
            size += parseFloat(sizes[i].size);
        }
    } else {
        const STORAGE_PATH = `../../data/storage${process.env.PREVIEW_MODE === "true" ? "_preview" : ""}.db`;

        size = fs.statSync(path.join(__dirname, STORAGE_PATH)).size;
    }

    return {size, testCount: await test.count()};
}

module.exports.validateInput = async (key, value) => {
    if (!value?.toString()) return "You need to provide the new value";

    if ((key === "ping" || key === "download" || key === "upload") && /[^0-9.]/.test(value))
        return "You need to provide a number in order to change this";

    if ((key === "ooklaId" || key === "libreId") && (/[^0-9]/.test(value) && value !== "none"))
        return "You need to provide a number in order to change this";

    if (key === "passwordLevel" && !["none", "read"].includes(value))
        return "You need to provide either none or read-access";

    if (key === "provider" && !["ookla", "libre", "cloudflare"].includes(value))
        return "You need to provide a valid provider";

    if (key === "ping")
        value = value.toString().split(".")[0];

    if (key === "password" && value !== "none")
        value = await bcrypt.hash(value, 10);

    if (key === "cron" && !cron.isValidCron(value.toString()))
        return "Not a valid cron expression";

    if (key === "interface" && !Object.keys(interfaces.interfaces).includes(value))
        return "The provided interface does not exist";

    if (configDefaults[key] === undefined)
        return "The provided key does not exist";

    if (process.env.PREVIEW_MODE === "true" && (key === "password" || key === "passwordLevel"))
        return "You can't change the password in preview mode";

    return {value: value};
}

module.exports.exportConfig = async () => {
    let obj = {};
    obj.config = {};

    let configValues = await config.findAll();
    for (let i = 0; i < configValues.length; i++) {
        if (configValues[i].key === "password" || configValues[i].key === "interface") continue;
        obj.config[configValues[i].key] = configValues[i].value;
    }

    obj.nodes = await node.findAll();
    obj.recommendations = await recommendations.findAll();

    obj.integrations = await integration.findAll();

    return obj;
}

module.exports.importConfig = async (obj) => {
    let configValues = obj.config;
    for (let key in configValues) {
        if (configDefaults[key] === undefined) continue
        if (key === "password") continue;

        const validate = await this.validateInput(key, configValues[key]);
        if (Object.keys(validate).length !== 1) return false;

        if (key === "cron") {
            timer.stopTimer();
            timer.startTimer(configValues[key].toString());
        }

        await config.update({value: validate.value}, {where: {key: key}});
    }

    if (recommendations.length > 1) return false;

    await node.destroy({where: {}});
    await recommendations.destroy({where: {}});
    await integration.destroy({where: {}});

    try {
        await node.bulkCreate(obj.nodes);

        for (let i = 0; i < obj.integrations.length; i++) {
            obj.integrations[i].data = JSON.parse(obj.integrations[i].data);
        }

        await integration.bulkCreate(obj.integrations);

        await recommendations.bulkCreate(obj.recommendations);
    } catch (e) {
        return false;
    }

    return true;
}

module.exports.factoryReset = async () => {
    let configValues = await config.findAll();
    for (let i = 0; i < configValues.length; i++) {
        await config.update({value: configDefaults[configValues[i].key]}, {where: {key: configValues[i].key}});
    }

    await node.destroy({where: {}});
    await recommendations.destroy({where: {}});
    await integration.destroy({where: {}});

    timer.stopTimer();
    timer.startTimer(configDefaults.cron);

    interfaces.requestInterfaces();

    return true;
}