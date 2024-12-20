const express = require('express');
const Restaurant = require('./models/Restaurant');
const Order = require('./models/order');
const router = express.Router();

// Route to get all restaurants with total orders, including those with 0 orders
router.get('/popular', async (req, res) => {
    try {
        // First, get all restaurant details from the Restaurant collection
        const allRestaurants = await Restaurant.find();

        // Aggregate orders by restaurant to get the total number of orders
        const restaurantOrders = await Order.aggregate([
            {
                $group: {
                    _id: "$usernameStore",  // Group by restaurant (usernameStore)
                    totalOrders: { $sum: 1 }, // Count total orders for each restaurant
                }
            }
        ]);

        // Combine the restaurant data with the order count
        const restaurantDetails = allRestaurants.map((restaurant) => {
            // Find the order count for this restaurant
            const orderData = restaurantOrders.find((order) => order._id === restaurant.username);

            // Return restaurant details with the total number of orders
            return {
                restaurantName: restaurant.name,
                restaurantImage: restaurant.ImageProfile,
                totalOrders: orderData ? orderData.totalOrders : 0, // If no orders, set to 0
            };
        });

        // Sort by the total number of orders (most to least)
        restaurantDetails.sort((a, b) => b.totalOrders - a.totalOrders);

        res.json(restaurantDetails); // Send the data as JSON response
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        res.status(500).json({ message: 'Error fetching restaurants' });
    }
});

module.exports = router;
