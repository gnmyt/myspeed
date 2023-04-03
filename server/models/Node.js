const Sequelize = require('sequelize');
const db = require("../config/database");

module.exports = db.define("nodes", {
    name: {
        type: Sequelize.STRING,
        defaultValue: "MySpeed Server"
    },
    url: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {createdAt: false, updatedAt: false});