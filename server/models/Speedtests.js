const Sequelize = require('sequelize');
const db = require("../config/database");

module.exports = db.define("speedtests", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    serverId: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    ping: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    download: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    upload: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    error: {
        type: Sequelize.STRING,
        allowNull: true
    },
    type: {
        type: Sequelize.STRING,
        defaultValue: "auto"
    },
    time: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
}, {createdAt: "created", updatedAt: false});