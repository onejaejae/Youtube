import React, { useState } from 'react'
import Axios from 'axios';
import { useSelector } from 'react-redux';

function Comment({PostId}) {
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
                    console.log(res.data)
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

            {/*  Root Comment Form */}

            <form style={ { display : 'flex '} } onsubmit = { onSubmit }>
                <textarea 
                    style={{ width : '100%', borderRadius : '5px' }}
                    onChange = { handleChange }
                    value={Comment}
                    placeholder="코멘트를 작성해 주세요"
                />
                <br />
                <button style={{ width : '20%', height : '52px' }} onClick= { onSubmit } >Submit</button>
            </form>

        </div>
    )
}

export default Comment
