const app = require('express').Router();
const tests = require('../controller/speedtests');

// List all speedtests
app.get("/", (req, res) => {
    res.json(tests.list());
});

// Runs a speedtest
app.post("/run", async (req, res) => {
    let speedtest = await require("../tasks/speedtest").create();
    if (speedtest !== undefined) return res.status(409).json({message: "An speedtest is already running"});
    res.json({message: "Speedtest successfully created"});
});

// List only the latest speedtest
app.get("/latest", (req, res) => {
    let latest = tests.latest();
    if (latest === undefined) return res.status(404).json({message: "No speedtest has been made yet"});
    res.json(latest);
});

// Get a specific speedtest
app.get("/:id", (req, res) => {
    let test = tests.get(req.params.id);
    if (test === undefined) res.status(404).json({message: "Speedtest not found"});
    res.json(test);
});

// Delete a specific speedtest
app.delete("/:id", (req, res) => {
    let test = tests.delete(req.params.id);
    if (test === undefined) return res.status(404).json({message: "Speedtest not found"});
    res.json({message: "Successfully deleted the provided speedtest"});
});

module.exports = app;