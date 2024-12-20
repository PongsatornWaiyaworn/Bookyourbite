const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        req.session.user = {
            id: user._id,
            username: user.username,
            role: user.role,
        };

        res.status(200).json({
            username: user.username,
            role: user.role,
            message: 'Login successful',
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Could not log out.');
        }
        res.clearCookie('connect.sid');
        res.status(200).send('Logout successful');
    });
});

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    return res.status(401).json({ message: 'Unauthorized' });
};

router.get('/check-auth', (req, res) => {
    if (req.session.user) {
        return res.status(200).json({ loggedIn: true, user: req.session.user });
    }
    return res.status(401).json({ loggedIn: false });
});

router.get('/protected-route', isAuthenticated, (req, res) => {
    res.status(200).json({ message: 'Access granted', user: req.session.user });
});

module.exports = router;
