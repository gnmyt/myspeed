const tests = require('../models/Speedtests');
const {Op, Sequelize} = require("sequelize");

// Inserts a new speedtest into the database
module.exports.create = async (ping, download, upload, time, type = "auto", error = null) => {
    return (await tests.create({ping, download, upload, error, type, time})).id;
}

// Gets a specific speedtest by id
module.exports.get = async (id) => {
    let speedtest = await tests.findByPk(id);
    if (speedtest.error === null) delete speedtest.error;
    return speedtest
}

// Lists all speedtests from the database
module.exports.list = async () => {
    let dbEntries = await tests.findAll({order: [["created", "DESC"]]});
    let all = [];

    dbEntries.forEach((entry) => {
        if (entry.error === null) delete entry.error
        all.push(entry);
    });

    return all;
}

// Gets the latest speedtest from the database
module.exports.latest = async () => {
    let speedtest = await tests.findOne({order: [["created", "DESC"]]});
    if (speedtest != null && speedtest.error === null) delete speedtest.error;
    return speedtest
}

// Deletes a specific speedtest
module.exports.delete = async (id) => {
    if (await this.get(id) === undefined) return undefined;
    await tests.destroy({where: {id: id}});
    return true;
}

// Removes speedtests older than 24 hours
module.exports.removeOld = async () => {
    await tests.destroy({
        where: {
            created: {
                [Op.lte]: Sequelize.literal(`datetime('now', '-1 day')`)
            }
        }
    });
    return true;
}