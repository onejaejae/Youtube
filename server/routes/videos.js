const express = require('express');
const router = express.Router();
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');

const { Video } = require('../models/Video');
const { Subscriber } = require('../models/Subscriber');


// STORAGE MULTER CONFIG
let storage = multer.diskStorage({
    // 위 설정을 실제로 활용하기 위해서는 서버에 uploads 폴더가 꼭 존재해야한다 
    // req 매개변수에는 요청에 대한 정보가
    // file 객체에는 업로드한 파일에 대한 정보가 있다
    // cb매개변수는 함수이다
    // cb함수에 첫 번째 인수에는 에러가 있다면 에러를 넣고,
    // 두번째 인수에는 실제 경로나 파일 이름을 넣어주면 된다

    // 어디에 저장할지
    destination : (req, file, cb) => {
        cb(null, 'uploads/');
    },

    // 어떤 이름으로
    // 현재 시간을 넣어주는 이유는 업로드하는 파일명이 겹치는 것을 막기 위해서
    filename : (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },

    // 동영상 파일만 허용
    fileFilter : (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if( ext !== '.mp4'){
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cb(null , true);
    }
   
})

// single안의 값 = formData의 append에서 key 값을 넣는다
const upload = multer({ storage : storage}).single("file");

router.post('/uploadfiles', upload, (req, res) => {
   
    // single 미들웨어를 라우터 미들웨어 앞에 넣어두면, multer 설정에 따라 파일 업로드 후
    // req.file 객체가 생성된다.
    // 업로드 성공 시 결과는 req.file 객체 안에 들어있다 

    // 비디오를 서버에 저장한다.
   return res.status(200).json({
       success : true,
       url : req.file.path,
       fileName : req.file.filename
   })
})

router.post('/uploadVideo', (req, res) => {
    // 비디오 정보들을 저장한다
    
    const video = new Video(req.body);

    video.save((err, doc) => {
        if(err){
            return res.status(400).send(err);
        }

        return res.status(200).json({
            success : true
        })
    })
    
})

router.post('/thumbnail', (req, res) => {

    let filePath = "";
    let fileDuration = "";

    // 비디오 정보 가져오기
    // ffmpeg 설치 시 함께 설치됨
    ffmpeg.ffprobe(req.body.url, function(err, metadata){
        fileDuration = metadata.format.duration;
    })

    // 썸네일 생성
    // 저장된 경로에 비디오 파일을 req.body.url로 가져온다
    ffmpeg(req.body.url)
        // filenames는 thumbnail의 filename을 만드는 작업
        .on('filenames', function( filenames ){
            console.log(filenames)
            console.log('Will generate ' + filenames.join(', '));
            
            
            // 콜백함수의 매개변수인 filenames을 이용해 filePath를 만듬
            filePath = "uploads/thumbnails/" + filenames[0];
        })
        // thumbnail을 생성하고 무엇을 할 것인지 
        // 모든 작업이 끝나면 실행
        .on('end', function(){
            console.log('Screenshots taken');
            return res.json({
                success : true,
                url : filePath,
                fileDuration : fileDuration
            })
        })
        // 에러가 발생 할 경우
        .on('error', function( err ){
            console.error(err);
            return res.json({
                success : false,
                err
            })
        })
        // 여러가지 옵션 설정
        .screenshot({
            // Will take screenshots at 20% 40& 60% and 80% of the video
            // count의 수에 : 썸네일의 개수
            count : 1,
            folder : 'uploads/thumbnails',
            size : '320x240',
            // 'b%' : input basename(filename w/o extension)
            filename : 'thumbnail-%b.png'
        })
})

router.get('/getVideos', (req, res) => {
    // 비디오를 DB에서 가져와서 클라이언트에 보낸다
    // populate를 해줘야 ref 한 database의 모든 정보를 가져올 수 있다!!!
    
    Video.find()
        .populate('writer')
        .exec((err, videos) => {
            if(err){
                return res.status(404).send(err);
            }

            return res.status(200).json({
                success : true,
                database : videos
            })
        })
})

router.post('/getVideoDetail', (req, res) => {
    Video.findOne({ "_id" : req.body.id })
        .populate('writer')
        .exec((err, video) => {
            if(err){
                res.status(404).send(err)
            }

            return res.status(200).json({
                success : true,
                video : video
            })
        })
})

router.post('/getSubscritionVideos', (req, res) => {
    
    // 자신의 id를 가지고 구독한 사람을 찾는다
    Subscriber.find({'userFrom' : req.body.userFrom})
        .exec((err, subscriberInfo) => {
            if(err){
                res.status(404).send(err)
            }

            let subscribedUser = [];
            subscriberInfo.map((subscriber, index) => {
                return subscribedUser.push(subscriber.userTo);
            })
            
            // 찾은 사람들의 비디오를 가져온다
            // $in 기능
           Video.find({'writer' : { $in : subscribedUser }})
                .populate('writer')
                .exec((err, videos) => {
                    if(err){
                        res.status(404).send(err)
                    }
        
                    return res.status(200).json({
                        success : true,
                        video : videos
                    })
                })
        })
})

module.exports = router;