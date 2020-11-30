import React, { useEffect, useState } from 'react'
import { Tooltip, Icon } from 'antd';
import Axios from 'axios';

function LikeDislikes({ videoId, video, commentId }) {
    const [LikeNumber, setLikeNumber] = useState(0);
    const [DisLikeNumber, setDisLikeNumber] = useState(0);
    const [IsLiked, setIsLiked] = useState(null);
    const [IsDisLiked, setIsDisLiked] = useState(null);

    const userId = localStorage.getItem('userId');
    let variable = {};
    
    if(video){
        variable = {
            videoId,
            userId
        }
    }else{
        variable = {
            commentId,
            userId
        }
    }

    useEffect(() => {
    
        Axios.post('/api/like/getLikes', variable)
            .then(res => {
                if(res.data.success){
                    // 몇개의 좋아요를 받았는지
                    setLikeNumber(res.data.likes.length);

                    // 내가 좋아요를 눌렀는지
                    res.data.likes.map((like, index) => {
                        if(like.userId === userId){
                            setIsLiked('liked');
                        }
                    })
                }else{
                    alert('좋아요 정보를 가져오는데 실패했습니다.');
                }
            })

            Axios.post('/api/like/getDisLikes', variable)
            .then(res => {
                if(res.data.success){
                    // 몇개의 싫어요를 받았는지
                    setDisLikeNumber(res.data.disLikes.length);
                    // 내가 싫어요를 눌렀는지
                    res.data.disLikes.map((disLikes, index) => {
                        if(disLikes.userId === userId){
                            setIsDisLiked('disLiked');
                        }
                    })
                }else{
                    alert('싫어요 정보를 가져오는데 실패했습니다.');
                }
            })
        
    }, [])

    // 유저가 좋아요를 안한 상태에서 좋아요를 누름
    //   => 좋아요 +1

    // 유저가 싫어요를 한 상태에서 좋아요를 누름
    // => 싫어요 -1 , 좋아요 +1

    // 유저가 좋아요를 누른 상태에서 좋아요를 누름
    // => 좋아요 -1
    const onLike = () => {
        // 유저가 좋아요를 눌렀을때
        if(IsLiked === null){
            Axios.post('/api/like/upLike', variable)
                .then(res => {
                    if(res.data.success){
                        setLikeNumber(LikeNumber + 1);
                        setIsLiked("liked");

                        // 만약 유저가 싫어요를 누른 상태였다면
                        if(IsDisLiked === "disLiked"){
                            setDisLikeNumber(DisLikeNumber - 1);
                            setIsDisLiked(null);
                        }
                    }else{
                        alert('좋아요를 누르는데 실패했습니다.');
                    }
                })
        }  
        // 유저가 좋아요를 누른 상태
        else if(IsLiked === "liked"){
            Axios.post('/api/like/unLike', variable)
                .then(res => {
                    if(res.data.success){
                        setLikeNumber(LikeNumber - 1);
                        setIsLiked(null);
                    }else{
                        alert('좋아요를 누르는데 실패했습니다.');
                    }
                })
        }
    }

    const onDisLike = () => {
        if(IsDisLiked === null){
            Axios.post('/api/like/upDisLike', variable)
                .then(res => {
                    if(res.data.success){
                        setDisLikeNumber(DisLikeNumber + 1);
                        setIsDisLiked("disLiked");
                        
                        // 좋아요가 눌러진 상태였다면
                        if(IsLiked === "liked"){
                            setLikeNumber(LikeNumber -1);
                            setIsLiked(null);
                        }
                    }else{
                        alert('싫어요를 누르는데 실패했습니다.');
                    }
                })
        }else{
            Axios.post('/api/like/unDisLike')
                .then(res => {
                    if(res.data.success){
                        setDisLikeNumber(DisLikeNumber -1);
                        setIsDisLiked(null);    
                    }else{
                        alert('싫어요를 누르는데 실패했습니다.');
                    }
                })
        }
    }

    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon type="like"
                        theme={IsLiked === "liked" ? 'filled' : 'outlined'}
                        onClick = { onLike }
                    />
                </Tooltip>
                <span style={{ paddingLeft:'8px', cursor:'auto' }}> { LikeNumber } </span>
            </span>

            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    <Icon type="dislike"
                       theme={ IsDisLiked === "disLiked" ? 'filled' : 'outlined'}
                        onClick = { onDisLike }
                    />
                </Tooltip>
                <span style={{ paddingLeft:'8px', cursor:'auto' }}> { DisLikeNumber } </span>
            </span>&nbsp;&nbsp;
        </div>
    )
}

export default LikeDislikes
