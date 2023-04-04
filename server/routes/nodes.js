const app = require('express').Router();
const nodes = require('../controller/node');
const password = require("../middlewares/password");

// List all nodes
app.get("/", password(false), async (req, res) => {
    return res.json(await nodes.list(true));
});

// Create a node
app.put("/", password(false), async (req, res) => {
    if (!req.body.name || !req.body.url) return res.status(400).json({message: "Missing parameters", type: "MISSING_PARAMETERS"});

    const url = req.body.url.replace(/\/+$/, "");

    const headers = req.body.password ? {password: req.body.password} : {};

    fetch(url + "/api/config", {headers}).then(async api => {
        if (api.status !== 200)
            return res.status(400).json({message: "Invalid URL", type: "INVALID_URL"});

        if ((await api.json()).viewMode)
            return res.status(400).json({message: "Invalid password", type: "PASSWORD_REQUIRED"});

        res.json({id: (await nodes.create(req.body.name, url, req.body.password)).id, type: "NODE_CREATED"});
    }).catch(async () => {
        res.status(400).json({message: "Invalid URL", type: "INVALID_URL"});
    });
});

// Delete a node
app.delete("/:nodeId", password(false), async (req, res) => {
    const node = await nodes.get(req.params.nodeId);
    if (node === null) return res.status(404).json({message: "Node not found"});

    await nodes.delete(req.params.nodeId);
    res.json({message: "Node successfully deleted"});
});

// Get information from the node
app.all("/:nodeId/*", password(false), async (req, res) => {
    const node = await nodes.get(req.params.nodeId);
    if (node === null) return res.status(404).json({message: "Node not found"});

    const url = node.url + req.originalUrl.replace("/api/nodes/" + req.params.nodeId, "/api");

    req.headers['password'] = node.password;
    delete req.headers['host'];

    fetch(url, {
        method: req.method,
        headers: req.headers,
        body: req.method === "GET" ? undefined : JSON.stringify(req.body),
        signal: req.signal
    }).then(async api => {
        if (api.headers.get("content-disposition"))
            res.setHeader("content-disposition", api.headers.get("content-disposition"));

        res.status(api.status).json(await api.json());
    }).catch(() => {
        res.status(500).json({message: "Internal server error"});
    });
});

module.exports = app;