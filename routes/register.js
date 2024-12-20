// routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('./models/User'); 
const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, name, password, phone, email, address, role } = req.body;

    try {

        // const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, 10); 

        // สร้าง user ใหม่
        const newUser = new User({
            username,
            name,
            password: hashedPassword, 
            phone,
            email,
            address,
            role,
        });

        await newUser.save();
        
        res.status(201).json({ success: true, message: 'User registered successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
