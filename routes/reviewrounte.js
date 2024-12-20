const express = require('express');
const Order = require('./models/order');
const Review = require('./models/review');
const router = express.Router();

router.post('/submitReview', async (req, res) => {
  const { orderId, score, comment } = req.body;

  if (!orderId || score === undefined || !comment) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // ตรวจสอบคำสั่ง (Order) ว่ามีหรือไม่
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // สร้างรีวิวใหม่
    const newReview = new Review({
      orderId,
      score,
      comment,
    });

    await newReview.save();
    await Order.findByIdAndDelete(orderId);

    res.status(200).json({ message: 'Review submitted and order deleted successfully', review: newReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
