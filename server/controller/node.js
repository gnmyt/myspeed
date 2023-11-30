const axios = require('axios');
const nodes = require('../models/Node');

module.exports.listAll = async () => await nodes.findAll()
    .then((result) => result.map((node) => ({...node, password: node.password !== null})));

module.exports.create = async (name, url, password) => await nodes.create({name: name, url: url, password: password});

module.exports.delete = async (nodeId) => await nodes.destroy({where: {id: nodeId}});

module.exports.getOne = async (nodeId) => await nodes.findOne({where: {id: nodeId}});

module.exports.updateName = async (nodeId, name) => await nodes.update({name: name}, {where: {id: nodeId}});

module.exports.updatePassword = async (nodeId, password) => await nodes.update({password: password}, {where: {id: nodeId}});

module.exports.checkStatus = async (url, password) => {
    if (password === "none") password = undefined;
    const api = await axios.get(url + "/api/config", {headers: {password: password}}).catch(() => {
        return "INVALID_URL";
    });

    if (api === "INVALID_URL" || api.status !== 200) return "INVALID_URL";

    if (!api.data.ping) return "INVALID_URL";

    if (api.data.viewMode) return "PASSWORD_REQUIRED";

    return "NODE_VALID";
}

module.exports.proxyRequest = async (url, req, res) => {
    const response = await axios(url, {
        method: req.method,
        headers: req.headers,
        data: req.method === "GET" ? undefined : JSON.stringify(req.body),
        signal: req.signal,
        validateStatus: (status) => status >= 200 && status < 400
    }).catch(() => "INVALID_URL");

    if (response === "INVALID_URL")
        return res.status(500).json({message: "Internal server error"});

    if (response.headers["content-disposition"])
        res.setHeader("content-disposition", response.headers["content-disposition"]);

    res.status(response.status).json(response.data);
}