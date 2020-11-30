import React, { useState } from 'react'
import Axios from 'axios';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

function Comment({ PostId, commentList, refreshFunction }) {
    const user = useSelector(state => state.user);
    const [Comment, setComment] = useState("");

    const handleChange = (e) => {
        setComment(e.target.value)
    }

    const onSubmit = (e) => {
        e.preventDefault();
       
        const variable = {
            writer : user.userData._id,
            PostId : PostId,
            content : Comment
        }
        
        Axios.post('/api/comment/saveComment', variable)
            .then(res => {
                if(res.data.success){
                    setComment("")
                    refreshFunction(res.data.comment)
                }else{
                    alert('댓글 저장에 실패했습니다');
                }
            })
    }

    return (
        <div>
            <br />
            <p> Replies </p>
            <hr />

            {/*  Comment List */}

            { commentList && commentList.map((comment, index) => (
                
                // responseTo가 없는 댓글만 출력
                // 즉 root 댓글
                ( !comment.responseTo &&   
                    // recat jsx문법으로 인해 React.Fragment 태그로 감싸줌
                    // div 같은 역할이라고 생각하면 된다.
                    <React.Fragment>
                        <SingleComment refreshFunction={ refreshFunction } comment={ comment }  />
                        <ReplyComment refreshFunction={ refreshFunction } commentList={ commentList } parentCommentId={ comment._id } />
                    </React.Fragment>
                )
             ))}
           

            {/*  Root Comment Form */}

            <form style={ { display : 'flex '} } onsubmit = { onSubmit }>
                <textarea 
                    style={{ width : '100%', borderRadius : '5px' }}
                    onChange = { handleChange }
                    value={ Comment }
                    placeholder="코멘트를 작성해 주세요"
                />
                <br />
                <button style={{ width : '20%', height : '52px' }} onClick= { onSubmit } >Submit</button>
            </form>

        </div>
    )
}

export default Comment
