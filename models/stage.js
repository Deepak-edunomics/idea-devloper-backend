const mongoose = require('mongoose')
const { Schema } = mongoose


const stageSchema = new Schema({
    workflow: {
        type: Schema.Types.ObjectId,
        ref: 'workflow'
    },
    stageName: {
        type: String,
        required: true
    },
    ideationStage: {
        type: Boolean,
        default: false
    },
    rules: [{
        ruleName: {
            type: String,
            required: true
        },
        rule: [{
            type: String,
            required: true
        }]
    }],
    questions: [{
        type: Schema.Types.ObjectId,
        ref: 'question'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('stage', stageSchema)
