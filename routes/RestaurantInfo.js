const express = require('express');
const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
const router = express.Router();

router.get('/:name', async (req, res) => {
    try {
        const { name } = req.params;

        // ค้นหาร้านอาหารจากชื่อร้าน
        const restaurant = await Restaurant.findOne({ name: name });
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        res.json(restaurant);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
