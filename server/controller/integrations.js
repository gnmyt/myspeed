const path = require("path");
const {readdirSync} = require("fs");
const IntegrationData = require("../models/IntegrationData");
const integrations = {};

const events = {};

const registerEvent = (module) => (name, callback) => {
    if (!events[name]) events[name] = [];
    events[name].push({module, callback});
}

const getActiveByName = async (name) => {
    const data = await IntegrationData.findAll({where: {name: name}});
    if (!data) return null;

    return data.map((item) => ({...item, data: JSON.parse(item.data)}));
}

const triggerActivity = async (id, error = false) => {
    await IntegrationData.update({lastActivity: new Date().toISOString(), activityFailed: error}, {where: {id: id}});
}

module.exports.triggerEvent = async (name, data) => {
    if (!events[name]) return;

    for (const module of events[name]) {
        const active = await getActiveByName(module.module);
        for (const integration of active)
            await module.callback(integration, data, (error = false) => triggerActivity(integration.id, error));
    }
}

module.exports.initialize = () => readdirSync(path.join(__dirname, "../integrations")).forEach(async (file) => {
    if (file.endsWith(".js")) {
        const integrationName = file.replace(".js", "");
        integrations[integrationName] = require(path.join(__dirname, "../integrations", file))(registerEvent(integrationName));
        console.log(`Integration "${integrationName}" loaded successfully`);
    }
});

module.exports.getActive = async () => {
    const data = await IntegrationData.findAll();
    if (!data) return null;

    return data.map((item) => ({...item, data: JSON.parse(item.data)}));
}

module.exports.getData = async (name, id) => {
    const integration = integrations[name];
    if (!integration) return null;

    const data = await IntegrationData.findOne({where: {name: name, integrationId: id}});
    if (!data) return null;

    return data.data;
}

module.exports.delete = async (id) => {
    const data = await IntegrationData.findOne({where: {id: id}});
    if (!data) return null;

    await IntegrationData.destroy({where: {id: id}});
    return true;
}

module.exports.create = async (name, data) => {
    const integration = integrations[name];
    if (!integration) return null;

    const displayName = data.integration_name;
    delete data.integration_name;

    const created = await IntegrationData.create({name: name, data: data, displayName});

    return created.id;
}

module.exports.patch = async (id, data) => {
    const item = await IntegrationData.findOne({where: {id: id}});
    if (!item) return null;

    const displayName = data.integration_name;
    delete data.integration_name;

    // find one and update
    IntegrationData.update({data: {...JSON.parse(item.data), ...data}, displayName}, {where: {id: id}});
    return true;
}

module.exports.getIntegrations = () => {
    const result = {};

    for (const [name, integration] of Object.entries(integrations))
        result[name] = {name, ...integration};

    return result;
};
module.exports.getIntegration = (name) => integrations[name];