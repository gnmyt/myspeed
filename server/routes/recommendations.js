const app = require('express').Router();
const recommendations = require('../controller/recommendations');

// Gets all config entries
app.get("/", async (req, res) => {
    let currentRecommendations = await recommendations.get();
    if (currentRecommendations === null) return res.status(501).json({message: "There are no recommendations yet"});

    return res.json(currentRecommendations);
});

module.exports = app;