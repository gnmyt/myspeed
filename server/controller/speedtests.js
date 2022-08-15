const tests = require('../models/Speedtests');
const {Op, Sequelize} = require("sequelize");

// Inserts a new speedtest into the database
module.exports.create = async (ping, download, upload, time, type = "auto", error = null) => {
    return (await tests.create({ping, download, upload, error, type, time})).id;
}

// Gets a specific speedtest by id
module.exports.get = async (id) => {
    let speedtest = await tests.findByPk(id);
    if (speedtest === null) return null;
    if (speedtest.error === null) delete speedtest.error;
    return speedtest
}

// Lists all speedtests from the database
module.exports.list = async (hours = 24) => {
    let dbEntries = (await tests.findAll({order: [["created", "DESC"]]}))
        .filter((entry) => new Date(entry.created) > new Date().getTime() - hours * 3600000);

    for (let dbEntry of dbEntries)
        if (dbEntry.error === null) delete dbEntry.error

    return dbEntries;
}

module.exports.listByDays = async (days) => {
    let dbEntries = (await tests.findAll({order: [["created", "DESC"]]})).filter((entry) => entry.error === null)
        .filter((entry) => new Date(entry.created) > new Date().getTime() - days * 24 * 3600000);

    let averages = {};
    dbEntries.forEach((entry) => {
        const day = new Date(entry.created).toLocaleDateString();
        if (!averages[day]) averages[day] = [];
        averages[day].push(entry);
    });

    return averages;
}

// Gets the latest speedtest from the database
module.exports.latest = async () => {
    let speedtest = await tests.findOne({order: [["created", "DESC"]]});
    if (speedtest != null && speedtest.error === null) delete speedtest.error;
    return speedtest
}

// Deletes a specific speedtest
module.exports.delete = async (id) => {
    if (await this.get(id) === null) return false;
    await tests.destroy({where: {id: id}});
    return true;
}

// Removes speedtests older than 30 days
module.exports.removeOld = async () => {
    await tests.destroy({
        where: {
            created: {
                [Op.lte]: Sequelize.literal(`datetime('now', '-30 days')`)
            }
        }
    });
    return true;
}