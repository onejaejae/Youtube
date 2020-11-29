const express = require('express');
const router = express.Router();
const { Comment } = require('../models/Comment');

router.post('/saveComment', (req, res) => {
    const comment = new Comment(req.body);
    console.log(req.body)

    // save를 사용할 경우 populate를 사용하지 못하므로
    // 그에 대한 대안으로 이와 같은 로직을 구성했다
    comment.save((err, comment) => {
        if(err) return res.status(400).json({
            success : false,
            err
        })

        Comment.findOne({'_id' : comment._id })
            .populate('writer')
            .exec((err, comment) => {
                if(err) return res.status(400).json({
                    success : false,
                    err
                })

                return res.status(200).json({
                    success : true,
                    comment
                })
            })

       
    })
})

router.post('/getComments', (req, res) => {
   
    Comment.find({'PostId' : req.body.id})
        .populate('writer')
        .exec((err, comments) => {
            if(err) return res.status(400).json({
                success : false,
                err
            })
        

            return res.status(200).json({
                success : true,
                comments
            })
        })
})

module.exports = router;
