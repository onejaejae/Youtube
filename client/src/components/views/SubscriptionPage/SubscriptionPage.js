import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Card, Icon, Avatar, Col, Typography, Row} from 'antd';
import { Link } from 'react-router-dom'; 
import Axios from 'axios';
import moment from 'moment';
import '../../../index.css';
const { Title } = Typography;
const { Meta } = Card;



function SubscriptionPage(props) {
    const [Video, setVideo] = useState([])
  
    useEffect(() => {
        const variable = {
            userFrom : localStorage.getItem('userId')
        }

     

        Axios.post('/api/video/getSubscritionVideos', variable)
            .then(res => {
                if(res.data.success){
                    setVideo(res.data.video)
                }else{
                    alert('비디오 가져오기를 실패했습니다.');
                }
            })
      
    }, [])

    const renderCards = Video.map((video, index) => {

        // duration을 받아올 때 모두 초 단위로 받아오기 때문에
        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor((video.duration - minutes * 60));

        return <Col lg={6} md={8} xs={24}>
        <Link to={`/video/post/${video._id}`}>
            <div style={{ position : 'relative'}}>
                <img style={{ width : '100%'}} src={`http://localhost:5000/${video.thumbnail}`} alt="thumbnail"/>
                <div className = "duration">
                    <span>{ minutes } : { seconds}</span>
                </div>
            </div>
        </Link>
        <br />
        <Meta
            avatar={
                // 유저 이미지 부분
                <Avatar src={video.writer.image} />
            }
            // 유저 이미지 옆 비디오 제목
            title={video.title}
            description=""
        />
        
        <span>{video.writer.name}</span><br />
        <span style={{ marginLeft : '3rem'}}>{video.views} views</span> - <span>{moment(video.createdAt).format("MMM Do YY")}</span>
        </Col>      


    })

    return (
      
        <div style={{ width : '85%', margin : '3rem auto'}}>
            <Title level={2}> Recommended</Title>
            <hr />
            <Row gutter={[32, 16]}>
                { renderCards }
            </Row>
          
        </div>
    )
}

export default SubscriptionPage
