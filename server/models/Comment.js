const mongoose = require('mongoose');
const { User } = require('./User');
const { Video } = require('./Video');

const CommentSchema = mongoose.Schema({
    writer : {
        type : mongoose.Schema.Types.ObjectId,
        ref : User
    },
    // 해당 비디오 id
    PostId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : Video
    },
    // 내가 대댓글 남긴 유저 정보(내가 첫댓글인 경우 데이터 없다)
    responseTo : {
        type : mongoose.Schema.Types.ObjectId,
        ref : User
    },
    content : {
        type : String
    }

})

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = { Comment };