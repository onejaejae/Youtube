import React, { useEffect, useState } from "react";
import { Row, Col, List, Avatar, Button } from "antd";
import Axios from "axios";
import SideVideo from "./Section/SideVideo";
import Subscribe from "./Section/Subscribe";
import { useSelector } from "react-redux";
import Comment from "./Section/Comment";

function VideoDetailPage(props) {
  const [VideoDetail, setVideoDetail] = useState([]);
  const [Comments, setComments] = useState([]);

  
  const id = props.match.params.id;
  const variable = {
    id,
  };

  useEffect(() => {
    Axios.post("/api/video/getVideoDetail", variable).then((res) => {
      if (res.data.success) {
        setVideoDetail(res.data.video);
      } else {
        alert("비디오 정보를 가져오는데 실패했습니다.");
      }
    });

    // 해당 비디오의 모든 댓글을 가져온 뒤
    // state의 데이터를 담아 하위 컴포넌트에 넘겨준다.
    Axios.post('/api/comment/getComments', variable)
      .then(res => {
        if(res.data.success){
          setComments(res.data.comments)
        }else{
          alert('댓글 정보를 가져오는데 실패했습니다.');
        }
        
      })
    
  }, []);

// videoDetail에서 useState를 통해 해당 비디오의 모든 댓글을 가져오고 뿌려준다
// 우리가 댓글을 다는 component는 comment, singlecomment component이기 때문에
// 댓글을 달면 하위 컴포넌트에서 부모 컴포넌트에 저장된 댓글을 업데이트해서 rerender되게 한다.
  const refreshFunction = (newComment) => {
    setComments(Comments.concat(newComment))
  }

  if (VideoDetail.writer) {
    return (
        
      // gutter 행과 행 사이의 간격
      <Row>
        <Col lg={18} xs={24}>
          <div style={{ width: "100%", padding: "3rem 4rem" }}>
            <video
              style={{ width: "100%" }}
              src={`http://localhost:5000/${VideoDetail.filePath}`}
              controls
            />

            {localStorage.getItem("userId") === VideoDetail.writer._id ? (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={VideoDetail.writer.image} />}
                  title={VideoDetail.title}
                  description={VideoDetail.description}
                />
              </List.Item>
            ) : (
              <List.Item actions={[<Subscribe id={VideoDetail.writer._id} />]}>
                <List.Item.Meta
                  avatar={<Avatar src={VideoDetail.writer.image} />}
                  title={VideoDetail.title}
                  description={VideoDetail.description}
                />
              </List.Item>
            )}

            {/*  Comments */}
              <Comment refreshFunction={ refreshFunction } commentList={Comments} PostId={id}/>
          </div>
        </Col>

        <Col lg={6} xs={24}>
          <SideVideo id={id} />
        </Col>
      

      </Row>
     
    );
  } else {
    return <div>...loading</div>;
  }
}

export default VideoDetailPage;
