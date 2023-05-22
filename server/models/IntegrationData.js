const Sequelize = require('sequelize');
const db = require("../config/database");

module.exports = db.define("integration_data", {
    id: {
        type: Sequelize.STRING,
        required: true,
        primaryKey: true,
        defaultValue: () => Math.random().toString(36).substring(2, 15)
    },
    displayName: {
        type: Sequelize.STRING,
        defaultValue: "Untitled"
    },
    name: {
        type: Sequelize.STRING,
        required: true,
    },
    data: {
        type: Sequelize.JSON,
        defaultValue: {},
    },
    lastActivity: {
        type: Sequelize.DATE,
        required: false
    },
    activityFailed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
}, {freezeTableName: true, createdAt: false, updatedAt: false});