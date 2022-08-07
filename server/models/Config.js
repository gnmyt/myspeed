const Sequelize = require('sequelize');
const db = require("../config/database");

module.exports = db.define("config", {
    key: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    value: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {freezeTableName: true, createdAt: false, updatedAt: false});