const express = require('express');
const router = express.Router();
const Restaurant = require('./models/Restaurant');
// const { route } = require('./order_routes');

router.put('/editprofile', async (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ message: "Fail" });
    }

    const { name,CuisineType,OpeningHours_start,OpeningHours_end} = req.body;

    try {
        const updatedOrder = await Restaurant.findOneAndUpdate(
            { username: req.session.user.username }, 
            { $set: { name:name,CuisineType:CuisineType,OpeningHours_start:OpeningHours_start,OpeningHours_end:OpeningHours_end} }, 
            { new: true } 
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "edit not found or unauthorized" });
        }

        res.status(200).json({ message: "edit successfully", order: updatedOrder });
    } catch (error) {
        console.error('Error cancelling edit:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }

});

module.exports = router;