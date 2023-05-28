const app = require('express').Router();
const integrations = require('../controller/integrations');
const password = require('../middlewares/password');
const {validateInput} = require("../controller/integrations");

app.get("/", password(false), (req, res) => res.json(integrations.getIntegrations()));

app.get("/active", password(false), async (req, res) => res.json(await integrations.getActive()));

app.put("/:integrationName", password(false), async (req, res) => {
    const integration = integrations.getIntegration(req.params.integrationName);
    if (!integration) return res.status(404).json({message: "Integration not found"});

    if (!req.body) return res.status(400).json({message: "Missing data"});

    const validatedInput = validateInput(req.params.integrationName, req.body);
    if (!validatedInput) return res.status(400).json({message: "Invalid data"});

    const id = await integrations.create(req.params.integrationName, validatedInput);
    return res.json({message: "Integration created", id});
});

app.patch("/:id", password(false), async (req, res) => {
    if (!req.body) return res.status(400).json({message: "Missing data"});

    const integration = await integrations.getIntegrationById(req.params.id);
    if (!integration) return res.status(404).json({message: "Integration not found"});

    const validatedInput = validateInput(integration?.name, req.body);
    if (!validatedInput) return res.status(400).json({message: "Invalid data"});

    await integrations.patch(req.params.id, validatedInput);
    return res.json({message: "Integration updated"});
});

app.delete("/:id", password(false), async (req, res) => {
    const result = await integrations.delete(req.params.id);
    if (result === null) return res.status(404).json({message: "Integration not found"});
    return res.json({message: "Integration deleted"});
});


module.exports = app;