const express = require('express');
const router = express.Router();

const { Like } = require('../models/Like');
const { Dislike } = require('../models/Dislike');


router.post('/getLikes', (req, res) => {
    
    let variable = {};
    
    // 비디오 정보인지 댓글 정보인지 분기처리를 해준다.
    if(req.body.videoId){
        variable = {
            'videoId' : req.body.videoId
        }
    }else{
        variable = {
            'commentId' : req.body.commentId
        }
    }


    Like.find(variable)
        .exec((err, likes) => {
            if(err) return res.status(400).json({
                success : false,
                err
            })

            return res.status(200).json({
                success : true,
                likes
            })
        })
})

router.post('/getDisLikes', (req, res) => {

    let variable = {};

    if(req.body.videoId){
        variable = {
            'userId' : req.body.userId,
            'videoId' : req.body.videoId
        }
    }else{
        variable = {
            'userId' : req.body.userId,
            'commentId' : req.body.commentId
        }
    }

    Dislike.find(variable)
        .exec((err, disLikes) => {
            if(err) return res.status(400).json({
                success : false,
                err
            })

            return res.status(200).json({
                success : true,
                disLikes
            })
        })
})

router.post('/upLike', (req, res) => {
    var variable = {};
    if(req.body.videoId){
        variable = {
            "userId" : req.body.userId,
            "videoId" : req.body.videoId
        }
    }else{
        variable = {
            "userId" : req.body.userId,
            "commentId" : req.body.commentId
        }
    }
    
    const like = new Like(req.body);
    
    like.save((err, doc) => {
        if(err) return res.status(400).json({
            success : false,
            err
        })

        // 만약 싫어요를 누른 상태였다면
        Dislike.findOneAndDelete(variable)
            .exec((err, doc) => {
                if(err) return res.status(400).json({
                    success : false,
                    err
                })

                return res.status(200).json({
                    success : true,
                    doc
                })
            })
        })
})

router.post('/unLike', (req, res) => {
    var variable = {};

    if(req.body.videoId){
        variable = {
            'userId' : req.body.userId,
            'videoId' : req.body.videoId
        }
    }else{
        variable = {
            'userId' : req.body.userId,
            'commentId' : req.body.commentId
        }
    }

    Like.findOneAndDelete(variable)
        .exec((err, doc) =>{
            if(err) return res.status(400).json({
                success : false,
                err
            })
    
            return res.status(200).json({
                success : true,
                doc
            })
        })
})

router.post('/upDisLike', (req, res) => {
    var variable = {};

    if(req.body.videoId){
        variable = {
            'userId' : req.body.userId,
            'videoId' : req.body.videoId
        }
    }else{
        variable = {
            'userId' : req.body.userId,
            'commentId' : req.body.commentId
        }
    }

    const disLike = new Dislike(req.body);
    
    disLike.save((err, doc) => {
        if(err) return res.status(400).json({
            success : false,
            err
        })

        Like.findOneAndDelete(variable)
            .exec((err, doc) => {
                if(err) return res.status(400).json({
                    success : false,
                    err
                })

                return res.status(200).json({
                    success : true
                })
            })
    })
})

router.post('/unDisLike', (req, res) => {
    var variable = {};

    if(req.body.videoId){
        variable = {
            'userId' : req.body.userId,
            'videoId' : req.body.videoId
        }
    }else{
        variable = {
            'userId' : req.body.userId,
            'commentId' : req.body.commentId
        }
    }

    Dislike.findOneAndDelete(variable)
        .exec((err, doc) =>  {
            if(err) return res.status(400).json({
                success : false,
                err
            })

            return res.status(200).json({
                success : true,
            })
        })
})

module.exports = router;