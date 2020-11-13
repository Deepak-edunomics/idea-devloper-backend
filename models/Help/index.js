const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HelpSchema = new Schema({
    title: {
        type: String
    },
    content: {
        type: String,
    },
    postedTime: {
        type: Date,
        default: Date.now
    },
    files: {
        type: String,
        default: ""
    },
    tags: [{ type: String }]
});

const HelpDoc = mongoose.model("Help", HelpSchema);
module.exports = { HelpDoc };