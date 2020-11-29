import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import Axios from 'axios';


function Subscribe( { id } ) {

    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)


    // const { userData : { _id }} = useSelector(state => state.user);

    const _id = localStorage.getItem('userId');
    
    useEffect(() => {
        const variable = {
            userTo : id, // 비디오의 업로드 유저의 _id
            userFrom : _id // 로그인 유저의 _id
        };

        // 구독자 수 받아오기
        Axios.post('/api/subscribe/subscribeNumber', variable)
            .then(res => {
                if(res.data.success){
                    setSubscribeNumber(res.data.subscribeNumber);
                }else{
                    alert('구독자 수 정보를 받아오지 못했습니다.');
                }
            })
        
        // 비디오 업로더를 구독했는지
        Axios.post('/api/subscribe/subscribed', variable)
            .then(res => {
                if(res.data.success){
                    setSubscribed(res.data.subscribed);
                }else{
                    alert('정보를 받아오지 못했습니다.');
                }
            })
        
    }, [])

    const onSubscribe = () => {
        const variable = {
            userTo : id,
            userFrom : _id
        }

        // 구독 취소
        if(Subscribed){ 
            Axios.post('/api/subscribe/unSubscribe', variable)
                .then(res => {
                    if(res.data.success){
                        setSubscribeNumber(SubscribeNumber - 1);
                        setSubscribed(!Subscribed);
                    }else{
                        alert('구독 취소에 실패했습니다.');
                    }
                })
            
        }
        // 구독
        else{ 
           
            Axios.post('/api/subscribe/Subscribe', variable)
                .then(res => {
                    if(res.data.success){
                        setSubscribeNumber(SubscribeNumber + 1);
                        setSubscribed(!Subscribed);
                    }else{
                        alert('구독에 실패했습니다.');
                    }
                })
        }
      
    }

    return (
        <div>
            <button
                style={{
                    backgroundColor : `${ Subscribed ? '#AAAAAA' : '#CC0000' }`, borderRadius : '4px',
                    color : 'white', padding : '10px 16px',
                    fontWeight : '500', fontSize : '1rem', textTransform : 'uppercase'
                }}
                onClick = { onSubscribe }
            >
                    {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
                </button>
        </div>
    )
}

export default Subscribe
