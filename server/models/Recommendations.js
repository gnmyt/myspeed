const Sequelize = require('sequelize');
const db = require("../config/database");

module.exports = db.define("recommendations", {
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
    }
}, {createdAt: false, updatedAt: false});