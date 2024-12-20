const express = require('express');
const Order = require('./models/order');
const moment = require('moment');
const Restaurant = require('./models/Restaurant');
const router = express.Router();

router.post('/order', async (req, res) => {
    const { usernameStore, date, time, num_people } = req.body; 
    if (!req.session || !req.session.user) {
        return res.status(400).json({ message: "Fail" });
    }
    const usernameUser = req.session.user.username;

    // ตรวจสอบว่าผู้ใช้กรอกข้อมูลครบหรือไม่
    if (!usernameStore || !usernameUser || !time || !date || !num_people) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const currentDate = moment();
    const selectedDateTime = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm');

    // ถ้าเวลาเลือกในอดีต, ไม่สามารถจองได้
    if (selectedDateTime.isBefore(currentDate, 'minute')) {
        return res.status(400).json({ message: 'Cannot book in the past. Please choose a future date and time.' });
    }

    try {
        const newOrder = new Order({
            usernameStore,
            usernameUser,
            date,
            time,
            num_people
        });

        await newOrder.save();
        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/order', async (req, res) => {
    
    if (!req.session && !req.session.user) {
        return res.status(400).json({ message: "Fail" });
    }

    try {
        const results = await Order.find({usernameStore: req.session.user.username});
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/orderC', async (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(400).json({ message: "Fail" });
    }

    try {
        // ดึงข้อมูลคำสั่งซื้อของผู้ใช้
        const orders = await Order.find({ usernameUser: req.session.user.username });

        const formattedResults = await Promise.all(
            orders.map(async (order) => {
                const restaurant = await Restaurant.findOne({ username: order.usernameStore });

                // ตรวจสอบว่าเป็นการจองในอนาคตหรือไม่
                const currentDate = new Date();
                const orderDate = new Date(order.date);
                let status = '';

                if (order.cancel) {
                    status = 'ยกเลิก'; // จองล่วงหน้า
                }else if(orderDate < currentDate){
                    status = "เสร็จสิ้น"
                } 
                else {
                    status = order.status ? 'ยืนยันแล้ว' : 'รอการยืนยัน'; // ตรวจสอบสถานะของการจอง
                }

                return {
                    id: order._id,
                    restaurantName: restaurant?.name || 'Unknown',
                    restaurantType: restaurant?.CuisineType || 'Unknown',
                    address: restaurant?.address || 'Unknown',
                    phone: restaurant?.phone || 'Unknown',
                    time: order.time,
                    date: order.date,
                    people: order.num_people,
                    status: status
                };
            })
        );

        res.json(formattedResults);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.put('/cancelorder', async (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ message: "Fail" });
    }

    const { orderId } = req.body;
    if (!orderId) {
        return res.status(400).json({ message: "Order ID is required" });
    }

    try {
        const updatedOrder = await Order.findOneAndUpdate(
            { _id: orderId, usernameStore: req.session.user.username }, 
            { $set: { cancel: true } }, 
            { new: true } 
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found or unauthorized" });
        }

        res.status(200).json({ message: "Order cancelled successfully", order: updatedOrder });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }

});
router.put('/finishorder', async (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ message: "Fail" });
    }

    const { orderId } = req.body;
    if (!orderId) {
        return res.status(400).json({ message: "Order ID is required" });
    }

    try {
        const updatedOrder = await Order.findOneAndUpdate(
            { _id: orderId, usernameStore: req.session.user.username }, 
            { $set: { status : true } }, 
            { new: true } 
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found or unauthorized" });
        }

        res.status(200).json({ message: "Order successfully", order: updatedOrder });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }

});


// อัพเดตสถานะของคำสั่ง (เช่น เปลี่ยนสถานะเป็นยืนยันแล้ว)
router.put('/updatestatus', async (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { orderId, status } = req.body;
    
    if (orderId === undefined || status === undefined) {
        return res.status(400).json({ message: "Order ID and status are required" });
    }

    try {
        const updatedOrder = await Order.findOneAndUpdate(
            { _id: orderId, usernameStore: req.session.user.username },
            { $set: { status: status } },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found or unauthorized" });
        }

        res.status(200).json({ message: "Order status updated successfully", order: updatedOrder });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.put('/updatecancel', async (req, res) => {

    if (!req.session || !req.session.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { orderId, cancel } = req.body;

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { cancel },
            { new: true }
        );
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order updated successfully', order: updatedOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/clear-old-orders', async (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        // หาวันที่ปัจจุบัน
        const currentDate = moment();

        // หาคำสั่งซื้อที่เกิน 30 วันและสถานะเป็น "เสร็จสิ้น"
        const expiredOrders = await Order.find({
            date: { $lt: currentDate.subtract(30, 'days').toDate() },
            cancel: true , 
        });

        const expiredOrders1 = await Order.find({
            date: { $lt: currentDate.subtract(60, 'days').toDate() },
            status: true,
        });

        // ถ้าไม่มีคำสั่งที่เกิน 30 วัน
        if (expiredOrders.length === 0) {
            return res.status(200).json({ message: "No orders older than 30 days found" });
        }

        // ลบคำสั่งซื้อที่เกิน 30 วัน
        await Order.deleteMany({
            _id: { $in: expiredOrders.map(order => order._id) }
        });

        res.status(200).json({ message: "Expired orders older than 30 days have been deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


module.exports = router;
