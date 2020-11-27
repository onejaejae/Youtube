const express = require('express');
const router = express.Router();
const { Subscriber } = require('../models/Subscriber');

router.post('/subscribeNumber', (req, res) => {
  
    Subscriber.find({'userTo' : req.body.userTo})
        .exec((err, info) => {
            if(err){
                return res.status(404).send(err);
            }

            return res.status(200).json({
                success : true,
                subscribeNumber : info.length
            })
        })
})

router.post('/subscribed', (req, res) => {
    Subscriber.findOne({'userTo' : req.body.userTo, 'userFrom' : req.body.userFrom }, (err, info) => {
        if(err){
            return res.status(404).send(err);
        }

        let subscribed = false;
        if(info){
            subscribed = true;
        }
        return res.status(200).json({
            success : true,
            subscribed
        })
    })
      
})

router.post('/Subscribe', (req, res) => {
    const subscribe = new Subscriber(req.body);
    subscribe.save((err, doc) => {
        if(err){
            return res.status(400).json({
                success : false,
                doc
            })
        }

        return res.status(200).json({
            success : true,
            doc
        })
    })
})

router.post('/unSubscribe', (req, res) => {
   Subscriber.findOneAndDelete({'userTo' : req.body.userTo, 'userFrom' : req.body.userFrom })
        .exec((err, doc) => {
            if(err){
                return res.status(400).json({
                    success : false,
                    err
                });
            }
    
            return res.status(200).json({
                success : true,
                doc
            })
        })
})

module.exports = router;