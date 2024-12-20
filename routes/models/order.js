const mongoose = require('mongoose');

const order = new mongoose.Schema({
    usernameStore: { type: String },
    usernameUser: { type: String },
    date: { type: String },
    time: { type: String },
    num_people: { type: Number },
    status: { type: Boolean, default: false},
    cancel: { type: Boolean, default: false}
});

module.exports = mongoose.model('orders', order);
