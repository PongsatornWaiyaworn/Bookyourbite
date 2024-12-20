// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/User');

// ดึงข้อมูลผู้ใช้
router.get('/profile', async (req, res) => {
    try {
        const userId = req.session.user.id; // ใช้ ID จาก session หรือ token
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user data' });
    }
});

router.put('/profile', async (req, res) => {
    try {
        const userId = req.session.user.id; 
        const { fullname, phone, address, oldPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (oldPassword && newPassword) {
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Old password is incorrect' });
            }

            const salt = await bcrypt.genSalt(10); 
            const hashedPassword = await bcrypt.hash(newPassword, salt); 
            user.password = hashedPassword; 
        }

        // อัปเดตข้อมูลอื่นๆ เช่น fullname, phone, address
        user.name = fullname || user.name;
        user.phone = phone || user.phone;
        user.address = address || user.address;

        await user.save(); // บันทึกข้อมูล
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating user data' });
    }
});

module.exports = router;
