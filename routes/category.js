const express = require('express');
const Restaurant = require('./models/Restaurant'); 
const router = express.Router();

router.get("/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const restaurants = await Restaurant.find({ CuisineType: category });
      res.json(restaurants);
    } catch (err) {
      res.status(500).json({ error: "Error" });
    }
  });

module.exports = router;
