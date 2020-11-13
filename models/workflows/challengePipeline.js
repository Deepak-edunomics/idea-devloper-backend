const mongoose = require('mongoose');

const challengePipelineSchema = mongoose.Schema({
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
   },
   idea: {
       type: Number,
       default: 0
   }
}, { timestamps: true });

module.exports = mongoose.model('challengePipeline', challengePipelineSchema);