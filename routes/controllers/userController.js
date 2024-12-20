const bcrypt = require('bcrypt');
const User = require('./models/User'); 

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // ใช้ bcrypt.compare เพื่อเปรียบเทียบรหัสผ่านที่แฮชแล้ว
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (isPasswordValid) {
            res.status(200).json({
                message: 'Login successful',
                username: user.username,
                userType: user.role
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = loginUser;
