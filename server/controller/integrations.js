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

module.exports.getIntegrationById = (id) => IntegrationData.findOne({where: {id: id}});

module.exports.delete = async (id) => {
    const data = await IntegrationData.findOne({where: {id}});
    if (!data) return null;

    await IntegrationData.destroy({where: {id}});
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

    IntegrationData.update({data: {...JSON.parse(item.data), ...data}, displayName}, {where: {id: id}});
    return true;
}

module.exports.getIntegrations = () => {
    const result = {};

    for (const [name, integration] of Object.entries(integrations)) {
        const updatedIntegration = {...integration};

        updatedIntegration.fields = updatedIntegration.fields.map((field) => ({
            ...field, regex: field.regex ? field.regex.source : undefined
        }));

        result[name] = {name, ...updatedIntegration};
    }

    return result;
};

module.exports.getIntegration = (name) => integrations[name];

module.exports.validateInput = (module, data) => {
    const integration = integrations[module];
    if (!integration) return false;

    for (const field of integration.fields) {
        if (field.required && (!data[field.name] || data[field.name] === "")) return false;

        if (data[field.name] !== undefined) {
            if (field.regex && !new RegExp(field.regex).test(data[field.name])) return false;
            if (field.type === "text" && data[field.name].length > 250) return false;
            if (field.type === "textarea" && data[field.name].length > 2000) return false;
            if (field.type === "boolean" && typeof data[field.name] !== "boolean") return false;
        }
    }

    const result = {};
    for (const field of integration.fields) result[field.name] = data[field.name];
    result["integration_name"] = data["integration_name"];

    return result;
}