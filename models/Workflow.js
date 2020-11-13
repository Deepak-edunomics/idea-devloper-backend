const mongoose = require('mongoose')
const { Schema } = mongoose

const workflowSchema = new Schema({
    workflowName: {
        type: String,
        required: true
    },
    stages: [{
        type: Schema.Types.ObjectId,
        ref: 'stage'
    }],
    workspace: {
        type: Schema.Types.ObjectId,
        ref: 'workspace'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('workflow', workflowSchema)