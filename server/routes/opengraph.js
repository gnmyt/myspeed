const express = require("express");
const app = express.Router();
const passwordWrapper = require('../middlewares/passwordWrapper');
const generateOpenGraphImage = require("../controller/opengraph");

app.get("/image", passwordWrapper(true, (req, res) => {
  // If there is a password set and the user does not want others to view their test data, return the project banner
  res.redirect('https://repository-images.githubusercontent.com/478222232/b5331514-aa27-4a56-af3e-c4b25446438d');
}), async (req, res) => {

  try {
    const png = await generateOpenGraphImage(req);

    if (!png) {
      return res.status(500).json({ message: "Error fetching test data" });
    }

    res.setHeader("Content-Type", "image/png").status(200).send(png);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = app;
