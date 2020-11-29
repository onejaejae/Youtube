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