const app = require('express').Router();
const integrations = require('../controller/integrations');
const password = require('../middlewares/password');

app.get("/", password(false), (req, res) => {
    return res.json(integrations.getIntegrations());
});

app.get("/active", password(false), async (req, res) => {
    const active = await integrations.getActive();
    return res.json(active);
});

app.put("/:integrationName", password(false), async (req, res) => {
    const integration = integrations.getIntegration(req.params.integrationName);
    if (!integration) return res.status(404).json({message: "Integration not found"});

    if (!req.body) return res.status(400).json({message: "Missing data"});

    // TODO: Validate input

    const id = await integrations.create(req.params.integrationName, req.body);
    return res.json({message: "Integration created", id});
});

app.patch("/:id", password(false), async (req, res) => {
    if (!req.body) return res.status(400).json({message: "Missing data"});

    await integrations.patch(req.params.id, req.body);
    return res.json({message: "Integration updated"});
});

app.delete("/:id", password(false), async (req, res) => {
    const result = await integrations.delete(req.params.id);
    if (result === null) return res.status(404).json({message: "Integration not found"});
    return res.json({message: "Integration deleted"});
});


module.exports = app;