const app = require('express').Router();
const nodes = require('../controller/node');
const password = require("../middlewares/password");
const {checkNode, proxyRequest} = require("../controller/node");

// List all nodes
app.get("/", password(false), async (req, res) => {
    return res.json(await nodes.list());
});

// Create a node
app.put("/", password(false), async (req, res) => {
    if (!req.body.name || !req.body.url) return res.status(400).json({message: "Missing parameters", type: "MISSING_PARAMETERS"});

    const url = req.body.url.replace(/\/+$/, "");

    checkNode(url, req.body.password).then(async (result) => {
        if (result === "INVALID_URL")
            return res.status(400).json({message: "Invalid URL", type: "INVALID_URL"});

        if (result === "PASSWORD_REQUIRED")
            return res.status(400).json({message: "Invalid password", type: "PASSWORD_REQUIRED"});

        res.json({id: (await nodes.create(req.body.name, url, req.body.password)).id, type: "NODE_CREATED"});
    });
});

// Delete a node
app.delete("/:nodeId", password(false), async (req, res) => {
    const node = await nodes.get(req.params.nodeId);
    if (node === null) return res.status(404).json({message: "Node not found"});

    await nodes.delete(req.params.nodeId);
    res.json({message: "Node successfully deleted"});
});

// Update the node name
app.patch("/:nodeId/name", password(false), async (req, res) => {
    if (!req.body.name) return res.status(400).json({message: "Missing parameters", type: "MISSING_PARAMETERS"});

    const node = await nodes.get(req.params.nodeId);
    if (node === null) return res.status(404).json({message: "Node not found"});

    await nodes.updateName(req.params.nodeId, req.body.name);
    res.json({message: "Node name successfully updated"});
});

// Update the node password
app.patch("/:nodeId/password", password(false), async (req, res) => {
    if (!req.body.password) return res.status(400).json({message: "Missing parameters", type: "MISSING_PARAMETERS"});

    const node = await nodes.get(req.params.nodeId);
    if (node === null) return res.status(404).json({message: "Node not found"});

    checkNode(node.url, req.body.password).then(async (result) => {
        if (result === "INVALID_URL")
            return res.status(400).json({message: "Invalid URL", type: "INVALID_URL"});

        if (result === "PASSWORD_REQUIRED")
            return res.status(400).json({message: "Invalid password", type: "PASSWORD_REQUIRED"});

        await nodes.updatePassword(req.params.nodeId, req.body.password === "none" ? null : req.body.password);
        res.json({message: "Node password successfully updated", type: "PASSWORD_UPDATED"});
    });
});

// Get information from the node
app.all("/:nodeId/*", password(false), async (req, res) => {
    const node = await nodes.get(req.params.nodeId);
    if (node === null) return res.status(404).json({message: "Node not found"});

    const url = node.url + req.originalUrl.replace("/api/nodes/" + req.params.nodeId, "/api");

    req.headers['password'] = node.password;
    delete req.headers['host'];

    await proxyRequest(url, req, res);
});

module.exports = app;