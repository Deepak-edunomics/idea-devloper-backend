const mongoose = require('mongoose');

const otpSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    userId: {
        type: mongoose.Schema.ObjectId,
    },
    otp: {
        type: String,
    },
    createdAt: { type: Date, expires: 600, default: Date.now }
});

module.exports = mongoose.model('otp', otpSchema);