const app = require('express').Router();
const tests = require('../controller/speedtests');
const pauseController = require('../controller/pause');

// List all speedtests
app.get("/", (req, res) => {
    res.json(tests.list());
});

// Runs a speedtest
app.post("/run", async (req, res) => {
    if (pauseController.currentState) return res.status(410).json({message: "The speedtests are currently paused"});
    let speedtest = await require("../tasks/speedtest").create("custom");
    if (speedtest !== undefined) return res.status(409).json({message: "An speedtest is already running"});
    res.json({message: "Speedtest successfully created"});
});

// List only the latest speedtest
app.get("/latest", (req, res) => {
    let latest = tests.latest();
    if (latest === undefined) return res.status(404).json({message: "No speedtest has been made yet"});
    res.json(latest);
});

// Get the current pause status
app.get("/status", (req, res) => {
    res.json({paused: pauseController.currentState});
});

// Pauses all speedtests
app.post("/pause", (req, res) => {
    if (!req.body.resumeIn) return res.status(400).json({message: "You need to provide when to resume"});

    if (req.body.resumeIn === -1) {
        pauseController.updateState(true);
    } else {
        pauseController.resumeIn(req.body.resumeIn);
    }
    
    res.json({message: "Successfully paused the speedtests"});
});

// Ends the pause-state
app.post("/continue", (req, res) => {
    pauseController.updateState(false);
    res.json({message: "Successfully resumed the speedtests"});
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