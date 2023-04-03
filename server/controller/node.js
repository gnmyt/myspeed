const nodes = require('../models/Node');

// Gets all node entries
module.exports.list = async (excludePassword) => {
    return await nodes.findAll({attributes: {exclude: excludePassword ? ['password'] : []}});
}

// Create a new node entry
module.exports.create = async (name, url, password) => {
    return await nodes.create({name: name, url: url, password: password});
}

// Delete a node entry
module.exports.delete = async (nodeId) => {
    return await nodes.destroy({where: {id: nodeId}});
}

// Get a specific node entry
module.exports.get = async (nodeId) => {
    return await nodes.findOne({where: {id: nodeId}});
}