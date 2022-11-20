const app = require('express').Router();
const recommendations = require('../controller/recommendations');
const password = require('../middlewares/password');

// Gets all config entries
app.get("/", password(false), async (req, res) => {
    let currentRecommendations = await recommendations.get();
    if (currentRecommendations === null) return res.status(501).json({message: "There are no recommendations yet"});

    return res.json(currentRecommendations);
});

module.exports = app;