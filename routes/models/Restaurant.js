const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    CuisineType: { type: String, required: true },
    OpeningHours_start: { type: String },
    OpeningHours_end: { type: String },
    ImageProfile: { type: String, required: true },
    ImageView: { type: String, required: true }
});

module.exports = mongoose.model('Restaurants', restaurantSchema);
