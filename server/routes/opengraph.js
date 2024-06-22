const express = require("express");
const app = express.Router();
const generateOpenGraphImage = require("../controller/opengraph");

app.get("/image", async (req, res) => {
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
