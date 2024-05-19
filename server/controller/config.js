const config = require("../models/Config");
const {triggerEvent} = require("./integrations");

const configDefaults = {
    ping: "25",
    download: "100",
    upload: "50",
    cron: "0 * * * *",
    provider: "none",
    ooklaId: "none",
    libreId: "none",
    password: "none",
    passwordLevel: "none"
}

module.exports.insertDefaults = async () => {
    let insert = [];
    for (let key in configDefaults) {
        if (!(await config.findOne({where: {key: key}})))
            insert.push({key: key, value: configDefaults[key]});
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