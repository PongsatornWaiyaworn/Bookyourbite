require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session'); 
const MongoStore = require('connect-mongo'); 
const register = require('./routes/register');
const order = require('./routes/order_routes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const loginAndlogutRoutes = require('./routes/LoginAndLogout');
const EditprofileRest = require('./routes/EditprofileRest');
const category = require('./routes/category');
const popular = require('./routes/popular');
const userRoutes = require('./routes/userRoutes');
const veiw = require('./routes/reviewrounte');
const RestaurantInfo = require('./routes/RestaurantInfo');
const app = express();
const PORT = process.env.REACT_APP_PORT_SERVER || 3000;
// const PORT_Origin = process.env.PORT || 5000;

// เชื่อมต่อกับ MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch(err => console.error("Error connecting to MongoDB:", err));

app.use(cors({
    origin: true,
    credentials: true, 
}));

// ตั้งค่า body-parser สำหรับ JSON
app.use(bodyParser.json({ limit: '10000mb' })); 
app.use(bodyParser.urlencoded({ limit: '10000mb', extended: true }));

// ตั้งค่า session
app.use(session({
    secret: process.env.SESSION_SECRET || 'bookyourbiteCSS223', 
    resave: false, 
    saveUninitialized: false, 
    cookie: {
        maxAge: 1000 * 60 * 60, // อายุ session 1 ชั่วโมง
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
    },
    store: MongoStore.create({ 
        mongoUrl: process.env.MONGODB_URI, 
        collectionName: 'sessions' 
    })
}));

// การใช้ routes
app.use('/api/users', register);
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/users', loginAndlogutRoutes);
app.use('/api/user', userRoutes);
app.use('/api', order);
app.use('/api',EditprofileRest);
app.use('/api/category', category);
app.use('/api', popular);
app.use('/api', RestaurantInfo);
app.use('/api', veiw);
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});