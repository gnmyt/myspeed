const {Sequelize} = require('sequelize');

const STORAGE_PATH = `data/storage${process.env.PREVIEW_MODE === "true" ? "_preview" : ""}.db`;

Sequelize.DATE.prototype._stringify = () => {
    return new Date().toISOString();
}

module.exports = new Sequelize({dialect: 'sqlite', storage: STORAGE_PATH, logging: false, query: {raw: true}});