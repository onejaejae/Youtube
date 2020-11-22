import React, { useEffect, useState } from 'react'
import { Row, Col, List, Avatar } from 'antd';
import Axios from 'axios';
import SideVideo from './Section/SideVideo';


function VideoDetailPage(props) {
    
    const [VideoDetail, setVideoDetail] = useState([]);

    const id = props.match.params.id;
    const variable = {
        id
    }

    useEffect(() => {
        Axios.post('/api/video/getVideoDetail' , variable)
            .then(res => {
                if(res.data.success){
                    setVideoDetail(res.data.video)
                  
                }else{
                    alert('비디오 정보를 가져오는데 실패했습니다.');
                }
            })
    }, [])

 
  if(VideoDetail.writer){
    return (
        // gutter 행과 행 사이의 간격
       <Row >
           <Col lg={18} xs={24}>
            <div style={{ width : '100%', padding : '3rem 4rem'}}>
                    <video style={{ width : '100%'} } src={`http://localhost:5000/${VideoDetail.filePath}`} controls />
                <List.Item
                    actions
                >   
                        <List.Item.Meta
                            avatar={
                                <Avatar src={VideoDetail.writer.image} />
                            }
                            title={VideoDetail.title}
                            description={VideoDetail.description}
                        />
                </List.Item>
                    
                {/*  Comments */}


            </div>

           </Col>

           <Col lg={6} xs={24} >
                <SideVideo id={ id } />
           </Col>

       </Row>
    )
  }else{
      return(
          <div>...loading</div>
      )
  }
   
}

export default VideoDetailPage
