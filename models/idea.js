const mongoose = require('mongoose');

const { Schema } = mongoose

const ideaSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    challengeLinks: [{
        type: String
    }],
    benefitSectors: [{
        type: String
    }],
    hide: {
        type: Boolean,
        default: false
    },
    organization: {
        type: String
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    attachement: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('idea', ideaSchema);