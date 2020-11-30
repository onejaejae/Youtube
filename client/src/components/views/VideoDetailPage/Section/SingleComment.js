import React, { useState } from "react";
import { Comment, Avatar, Button, Input } from "antd";
import Axios from "axios";
import LikeDislikes from "./LikeDislikes";

const { TextArea } = Input;

function SingleComment({ comment, refreshFunction }) {
  const [OpenReply, setOpenReply] = useState(false);
  const [CommentValue, setCommentValue] = useState("");
  
 
  const openReply = () => {
    setOpenReply(!OpenReply);
  };

  const handleChange = (e) => {
    setCommentValue(e.target.value);
  }

  const onSubmit = (e) => {
      e.preventDefault();

      const variable = {
        PostId : comment.PostId,
        responseTo : comment._id,
        writer : localStorage.getItem('userId'),
        content : CommentValue
      }

      Axios.post('/api/comment/saveComment', variable)
            .then(res => {
                if(res.data.success){
                  setCommentValue("");
                  setOpenReply(false);
                  refreshFunction(res.data.comment);
                }else{
                    alert('댓글 저장에 실패했습니다');
                }
            })
  }

  const actions = [
    <LikeDislikes commentId={ comment._id }/>,
    <span onClick={ openReply } key="comment-basic-reply-to">Reply to</span>
  ];

  return (
    <div>
      <Comment 
            actions={actions} 
            author = {comment.writer.name}
            avatar={<Avatar src={comment.writer.image} alt="image" />} 
            content = { comment.content }
     />
      {OpenReply && (
        <form style={{ display: "flex " }} onsubmit = { onSubmit }>
          <TextArea
            style={{ width: "100%", borderRadius: "5px" }}
            onChange={ handleChange }
            value={ CommentValue }
            placeholder="코멘트를 작성해 주세요"
          />
          <br />
          <button style={{ width: "20%", height: "52px" }} onClick = { onSubmit }>
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

export default SingleComment;
