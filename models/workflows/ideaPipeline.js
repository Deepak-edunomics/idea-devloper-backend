const mongoose = require('mongoose');

const ideaPipelineSchema = mongoose.Schema({
   title: {
       type: String,
       required: true
   },
   organization: {
       type: String,
       required: true
   },
   comment: {
       type: Number,
       default: 0
   },
   like: {
       type: Number,
       default: 0
   },
   upvote: {
       type: Number,
       default: 0
   },
   downvote: {
       type: Number,
       default: 0
   },
   rating: {
       type: Number,
       default: 0
   },
   duration: {
       type: Number
   },
   effort: {
       type: Number,
       default: 0
   },
   impact: {
       type: Number,
       default: 0
   },
   rank: {
       type: Number,
       required: true
   }
}, { timestamps: true });

module.exports = mongoose.model('ideaPipeline', ideaPipelineSchema);