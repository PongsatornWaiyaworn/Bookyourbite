const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    name: { type: String },
    password: { type: String, required: true },
    phone: { type: String },
    email: { type: String, required: true, unique: true },
    address: { type: String },
    role: { type: String, required: true } // "customer" or "store"
});

module.exports = mongoose.model('User', userSchema);