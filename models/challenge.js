const mongoose = require('mongoose');

const { Schema } = mongoose

const challengeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
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
    categories: [{
        type: String
    }],
    groups: [{
        type: String
    }],
    hide: {
        type: Boolean,
        default: false
    },
    tags: [{
        type: String
    }],
    organization: {
        type: String
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    image: {
        type: String
    },
    attachement: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('challenge', challengeSchema);