const mongoose = require('mongoose');

const { Schema } = mongoose

const permissionSchema = new Schema({
    role: {
        type: String,
        required: true
    },
    createWs: {
        type: Boolean,
        default: false
    },
    viewWs: {
        type: Boolean,
        default: false
    },
    editWs: {
        type: Boolean,
        default: false
    },
    deleteWs: {
        type: Boolean,
        default: false
    },
    createCllg: {
        type: Boolean,
        default: false
    },
    viewCllg: {
        type: Boolean,
        default: false
    },
    editCllg: {
        type: Boolean,
        default: false
    },
    deleteCllg: {
        type: Boolean,
        default: false
    },
    createPipelineCllg: {
        type: Boolean,
        default: false
    },
    viewPipelineCllg: {
        type: Boolean,
        default: false
    },
    editPipelineCllg: {
        type: Boolean,
        default: false
    },
    deletePipelineCllg: {
        type: Boolean,
        default: false
    },
    createIdea: {
        type: Boolean,
        default: false
    },
    viewIdea: {
        type: Boolean,
        default: false
    },
    editIdea: {
        type: Boolean,
        default: false
    },
    deleteIdea: {
        type: Boolean,
        default: false
    },
    createPipelineIdea: {
        type: Boolean,
        default: false
    },
    viewPipelineIdea: {
        type: Boolean,
        default: false
    },
    editPipelineIdea: {
        type: Boolean,
        default: false
    },
    deletePipelineIdea: {
        type: Boolean,
        default: false
    },
    organization: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('permission', permissionSchema);