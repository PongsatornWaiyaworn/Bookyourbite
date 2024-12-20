const express = require('express');
const Restaurant = require('./models/Restaurant');

const router = express.Router();

router.post('/upDefault', async (req, res) => {
    // ตรวจสอบข้อมูลที่ได้รับจาก client
    const { username, name, address, phone, CuisineType, OpeningHours_start, OpeningHours_end, ImageProfile, ImageView } = req.body;

    try {
        // สร้างใหม่ Restaurant document
        const newRestaurant = new Restaurant({
            username,
            CuisineType,
            name,
            address,
            phone,
            OpeningHours_start,
            OpeningHours_end,
            ImageProfile,
            ImageView
        });

        await newRestaurant.save();
        res.status(201).json({ success: true, message: 'Store updated successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


router.put('/updateStore/:id', async (req, res) => {
    const { id } = req.params; 
    const { 
        name, 
        address, 
        phone, 
        CuisineType, 
        OpeningHours_start, 
        OpeningHours_end, 
        ImageProfile, 
        ImageView,
    } = req.body;

    try {
        // ค้นหาและอัปเดตรายการตาม ID
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            id,
            {
                name,
                address,
                phone,
                CuisineType,
                OpeningHours_start,
                OpeningHours_end,
                ImageProfile,
                ImageView,
            },
            { new: true } 
        );

        if (!updatedRestaurant) {
            return res.status(404).json({ success: false, message: "Restaurant not found" });
        }

        res.status(200).json({ success: true, message: "Store updated successfully!", data: updatedRestaurant });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.get('/search', async (req, res) => {
    const query = req.query.q;
    
    if (typeof query !== 'string') {
        return res.status(400).json({ message: "Search query must be a string." });
    }

    try {
        const results = await Restaurant.find({ name: { $regex: query, $options: 'i' } });
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/searchusername', async (req, res) => {

    if (!req.session || !req.session.user) {
        return res.status(401).json({ message: "Fail" });
    }

    try {
        const results = await Restaurant.find({ username: req.session.user.username });
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
