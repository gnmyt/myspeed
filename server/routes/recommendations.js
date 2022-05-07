const app = require('express').Router();
const recommendations = require('../controller/recommendations');

// Gets all config entries
app.get("/", (req, res) => {
    let currentRecommendations = recommendations.get();
    if (currentRecommendations === undefined) return res.status(501).json({message: "There are no recommendations yet"});

    return res.json(currentRecommendations);
});

module.exports = app;