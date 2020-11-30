const mongoose = require('mongoose');
const { User } = require('./User');
const { Comment } = require('./Comment');
const { Video } = require('./Video');

const likeSchema = mongoose.Schema({
    userId : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : User
    },
    // 어떤 댓글에 좋아요를 했는지
    commentId : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : Comment
    },
    // 어떤 비디오에 좋아요를 했는지
    videoId : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : Video
    }
}, { timestamps : true })

const Like = mongoose.model('Like', likeSchema);
module.exports = { Like };