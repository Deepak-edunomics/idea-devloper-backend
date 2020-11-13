const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Blogs = new Schema({
    title: {
        type: String,
    },
    blog_content: {
        type: String
    },
    files: {
        type: String,
        default: ""
    },
    uploadDate: {
        type: Date,
        default: Date.now()
    },
    tags: [
        { type: String },
    ],
});


module.exports = mongoose.model("blogs", Blogs);