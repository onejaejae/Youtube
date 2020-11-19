const express = require('express');
const router = express.Router();
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');

const { User } = require("../models/User");
const { auth } = require("../middleware/auth");

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

router.post('/uploadfiles', (req, res) => {
   
    // 비디오를 서버에 저장한다.
    upload(req, res, err => {
        if(err){
            return res.json({
                success : false,
                err
            })
        }

        return res.json({
            success : true,
            url : res.req.file.path,
            fileName : res.req.file.filename
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
            console.log('Will generate ' + filenames.join(', '));
            console.log(filenames);
            
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

module.exports = router;