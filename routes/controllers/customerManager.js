const User = require('./models/User'); 

const customer = async (req, res) => {
    const { username } = req.body;
    try {
        const order = await User.findOne({ username });
        
        if (!order) {
            return res.status(401).json({ message: 'No order' });
        }else {
            res.status(200).json({
                usernameStore: order.usernameStore,
                usernameUser: order.usernameUser,
                time: order.time
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = customer;
