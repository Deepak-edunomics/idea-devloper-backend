const mongoose = require('mongoose')
const { Schema } = mongoose

const workSpaceSchema = new Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    moderators: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    challengeType: {
        type: String,
        required: true
    },
    challengeMembers: [{
        type: Schema.Types.ObjectId,
        ref: 'user',
    }],
    ideaMembers: [{
        type: Schema.Types.ObjectId,
        ref: 'user',

    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    workflows: [{
        type: Schema.Types.ObjectId,
        ref: 'workflow'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('workspace', workSpaceSchema)