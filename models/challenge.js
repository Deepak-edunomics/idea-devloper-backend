const mongoose = require('mongoose');

const challengeSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true,
    },
    endDate: {
        type: String,
        required: true,
    },
    category: [{
        type: String,
    }],
    hide: {
        type: Boolean,
        default: false
    },
    tags: [{
        type: String,
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId
    },
    bgImage: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('challenge', challengeSchema);