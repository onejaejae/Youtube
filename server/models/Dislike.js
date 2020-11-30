const mongoose = require('mongoose');
const { User } = require('./User');
const { Comment } = require('./Comment');
const { Video } = require('./Video');

const DislikeSchema = mongoose.Schema({
    userId : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : User
    },

    commentId : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : Comment
    },

    videoId : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : Video
    }
})

const Dislike = mongoose.model('Dislike', DislikeSchema);
module.exports = { Dislike };