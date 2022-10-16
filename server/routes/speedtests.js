const app = require('express').Router();
const tests = require('../controller/speedtests');
const pauseController = require('../controller/pause');
const config = require('../controller/config');
const testTask = require("../tasks/speedtest");

// List all speedtests
app.get("/", async (req, res) => {
    res.json(await tests.list(req.query.hours || 24));
});

// List all speedtests by average
app.get("/averages", async (req, res) => {
    res.json(await tests.listAverage(req.query.days || 7));
});

// Runs a speedtest
app.post("/run", async (req, res) => {
    if (pauseController.currentState) return res.status(410).json({message: "The speedtests are currently paused"});
    if ((await config.get("acceptOoklaLicense")).value === 'false') return res.status(410).json({message: "You need to accept the ookla license first"});
    let speedtest = await testTask.create("custom");
    if (speedtest !== undefined) return res.status(409).json({message: "An speedtest is already running"});
    res.json({message: "Speedtest successfully created"});
});

// Get the current test status
app.get("/status", (req, res) => {
    res.json({paused: pauseController.currentState, running: testTask.isRunning()});
});

// Pauses all speedtests
app.post("/pause", (req, res) => {
    if (!req.body.resumeIn) return res.status(400).json({message: "You need to provide when to resume"});

    if (req.body.resumeIn === -1) {
        pauseController.updateState(true);
    } else if (!pauseController.resumeIn(req.body.resumeIn)) {
        return res.status(400).json({message: "You need to provide when to resume"});
    }

    res.json({message: "Successfully paused the speedtests"});
});

// Ends the pause-state
app.post("/continue", (req, res) => {
    pauseController.updateState(false);
    res.json({message: "Successfully resumed the speedtests"});
});

// Get a specific speedtest
app.get("/:id", async (req, res) => {
    let test = await tests.get(req.params.id);
    if (test === null) return res.status(404).json({message: "Speedtest not found"});
    res.json(test);
});

// Delete a specific speedtest
app.delete("/:id", async (req, res) => {
    let test = await tests.delete(req.params.id);
    if (!test) return res.status(404).json({message: "Speedtest not found"});
    res.json({message: "Successfully deleted the provided speedtest"});
});

module.exports = app;