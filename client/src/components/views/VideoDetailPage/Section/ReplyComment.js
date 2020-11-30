import React, { useEffect, useState } from 'react'
import SingleComment from './SingleComment';


function ReplyComment({ commentList, parentCommentId, refreshFunction}) {
    const [ChildCommentNumber, setChildCommentNumber] = useState(0);
    const [OpenReplyCommnet, setOpenReplyCommnet] = useState(false);
    
    // useEffect []인 경우 componentDidmount와 같으니까
    // reply 댓글을 달아도 한번밖에 render가 안된다.
    // 그러므로 부모로부터 받은 commentList의 값이 바뀔때마다 rerender작업을 수행하게 하여 
    // 새로고침 없이 페이지를 구성할 수 있다.
    useEffect(() => {

        let commentNumber = 0;
        commentList.map((comment) => {

            if (comment.responseTo === parentCommentId) {
                commentNumber++
            }
        })
        setChildCommentNumber(commentNumber)
    }, [commentList, parentCommentId])


    var renderReplyComment = (refreshFunction) => 
       
        commentList.map((comment, index) => (
            
            <React.Fragment>
                {   
                // 모든 댓글 중에서 comment.responseTo가 있는 댓글 중 parentCommentId와 같은것들만
                    comment.responseTo === parentCommentId &&
                    <div style={{ width:'80%', marginLeft : '40px'}}>
                        <SingleComment refreshFunction={ refreshFunction } comment={ comment }/>
                        {/*  parentCommentId={comment._id}로 줘야하는 것을 명심 */}
                        <ReplyComment commentList={ commentList } refreshFunction={ refreshFunction } parentCommentId={comment._id}/>
                    </div>
                }
            </React.Fragment>
        ))
    
    
    const onHandleChange = () => {
        setOpenReplyCommnet(!OpenReplyCommnet);
    }
  

    return (
        <div>
            { ChildCommentNumber > 0 && 
                <p style={{ fontSize : '14px', margin : 0, color : 'gray' }} onClick={ onHandleChange } >
                View {ChildCommentNumber} more comment(s)
                </p>
            }
            
            { OpenReplyCommnet && renderReplyComment(refreshFunction) }
           

        </div>
    )
}

export default ReplyComment
