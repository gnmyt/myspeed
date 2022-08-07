const {Sequelize} = require('sequelize');

Sequelize.DATE.prototype._stringify = () => {
    return new Date().toISOString();
}

module.exports = new Sequelize({dialect: 'sqlite', storage: 'data/storage.db', logging: false, query: {raw: true}});