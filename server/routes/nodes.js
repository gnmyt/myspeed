const app = require('express').Router();
const nodes = require('../controller/node');

// List all nodes
app.get("/", async (req, res) => {
    return res.json(await nodes.list(true));
});

// Create a node
app.put("/", async (req, res) => {
    if (!req.body.name || !req.body.url || !req.body.password) return res.status(400).json({message: "Missing parameters"});

    const url = req.body.url.replace(/\/+$/, "");

    fetch(url + "/api/config", {headers: {password: req.body.password}}).then(async api => {
        if (api.status !== 200)
            return res.status(400).json({message: "Invalid URL or password"});

        if ((await api.json()).viewMode)
            return res.status(400).json({message: "Invalid URL or password"});

        res.json({id: (await nodes.create(req.body.name, url, req.body.password)).id});
    }).catch(async () => {
        res.status(400).json({message: "Invalid URL or password"});
    });
});

// Delete a node
app.delete("/:nodeId", async (req, res) => {
    const node = await nodes.get(req.params.nodeId);
    if (node === null) return res.status(404).json({message: "Node not found"});

    await nodes.delete(req.params.nodeId);
    res.json({message: "Node successfully deleted"});
});

// Get information from the node
app.get("/:nodeId/*", async (req, res) => {
    const node = await nodes.get(req.params.nodeId);
    if (node === null) return res.status(404).json({message: "Node not found"});

    const url = node.url + req.originalUrl.replace("/api/nodes/" + req.params.nodeId, "/api");

    req.headers['password'] = node.password;
    delete req.headers['host'];

    fetch(url, {
        method: req.method,
        headers: req.headers,
        body: req.method === "GET" ? undefined : req.body
    }).then(async api => {
        res.status(api.status).json(await api.json());
    }).catch(() => {
        res.status(500).json({message: "Internal server error"});
    });
});

module.exports = app;