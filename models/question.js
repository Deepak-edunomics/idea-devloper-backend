const mongoose = require('mongoose')
const { Schema } = mongoose


const questionSchema = new Schema({
    stage: {
        type: Schema.Types.ObjectId,
        ref: 'stage'
    },
    questionType: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required:true
    },
    options: [{
        type: String
    }],
    answer: {
        type: String,
        required: true
    },
    point: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('question', questionSchema)
