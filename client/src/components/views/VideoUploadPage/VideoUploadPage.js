import React, { useState } from 'react'
import { Typography, Button, Form, message, Input, Icon } from 'antd'
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import { useSelector } from 'react-redux';

const { TextArea } = Input;
const { Title } = Typography;

const PrivateOptions = [
    { value : 0, label : "Private"},
    { value : 1, label : "Public"}
];

const CategoryOptions = [
    { value : 0 , label : "Film & Animation"},
    { value : 1 , label : "Autos & Vehicles"},
    { value : 2 , label : "Music"},
    { value : 3 , label : "Pets & Animals"}
]


function VideoUploadPage(props) {
   

    const [VideoTitle, setVideoTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [Private, setPrivate] = useState(0);
    const [Category, setCategory] = useState("Film & Animation");
    const [FilePath, setFilePath] = useState("");
    const [ThumbnailPath, setThumbnailPath] = useState("");
    const [Duration, setDuration] = useState("")

    // react-redux 에서 useSelector Hook 사용하기 
    // 이 Hook 을 통하여 우리는 리덕스 스토어의 상태에 접근 할 수 있습니다.
    // 모든 page에 접근할때 마다 hoc폴더의 auth.js로 인해 인증 절차를 거친다.
    // 그러므로 페이지에 접근할 때마다 dispatch가 작동해 redux state가 update된다.
    // 결국 useSelector를 사용해 dispatch auth() action이 전달한 값들을 접근 할 수있다.
    const user = useSelector(state => state.user);
    
    const onChangeTitle = (e) => {
        setVideoTitle(e.target.value);
    }

    const onChangeDescription = (e) => {
        setDescription(e.target.value);
    }

    const onPrivateChange = (e) => {
        setPrivate(e.target.value);
    }

    const onCategoryChange = (e) => {
        setCategory(e.target.value);
    }

    const onDrop = ( files ) => {
        let formData = new FormData;
        const config = {
            // 파일 전송을 위한 인코딩
            header : { 'content-type' : 'multipart/form-data'}
        }
        formData.append("file", files[0]);
      
        
        Axios.post('/api/video/uploadfiles', formData, config)
            .then(res => {
                if(res.data.success){
                   let variable = {
                       url : res.data.url,
                       fileName : res.data.fileName
                   }

                   setFilePath(res.data.url);
                
                   Axios.post('/api/video/thumbnail', variable)
                    .then(res => {
                        if(res.data.success){
                           
                            setThumbnailPath(res.data.url);
                            setDuration(res.data.fileDuration);
                           

                        }else{
                            alert('썸네일 생성에 실패했습니다');
                        }
                    })
                } else{
                    alert("비디오 업로드에 실패했습니다");
                }
            })
    }

    const onSubmit = (e) => {
        e.preventDefault();
        
      
        const variable = {
            writer :  user.userData._id,
            title : VideoTitle,
            description : Description,
            privacy : Private,
            filePath : FilePath,
            category : Category,
            duration : Duration,
            thumbnail : ThumbnailPath
        }

        Axios.post('/api/video/uploadVideo', variable)
            .then(res => {
                if(res.data.success){
                    message.success('성공적으로 업로드를 했습니다');
                    
                    setTimeout(() => {
                        props.history.push('/')
                    }, 3000);

                }else{
                    alert('비디오 업로드에 실패했습니다.');
                }
            })

    }

  
    return (
        <div style={{ maxWidth:'700px', margin : '2rem auto ' }}>
            <div style={{ textAlign:'center', marginBottom:'2rem'}}>
                <Title level={2} >Upload Video</Title>
            </div>
           
           <Form onSubmit = { onSubmit }>
               <div style={{ display:'flex', justifyContent:'space-between'}}>
                    {/* Drop Zone */}
                        <Dropzone
                            onDrop = { onDrop }
                            multiple = { false }
                            maxSize = { 10000000000 }
                        >

                        {({ getRootProps, getInputProps }) => (
                            <div style={{ width:'300px', height:'240px', border:'1px solid lightgray', display:'flex',
                            alignItems:'center', justifyContent:'center'}}{...getRootProps()}>
                                <input {...getInputProps()} />
                                <Icon type="plus" style={{fontSize:'3rem'}}/>
                            </div>
                        )}
                        
                        </Dropzone>
                    
                    {/* Thumbnail */}
                            
                        
                         { ThumbnailPath && 
                            <div>
                                {/* server 5000 port에 저장되있기 떄문*/}
                                <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail"/>
                            </div>
                         }   
                       
               </div>

                <br />
                <br />
                <label>Title</label>
                <Input
                    onChange={ onChangeTitle }
                    value = { VideoTitle }
                />

                <br />
                <br />

                <label>Description</label>
                <TextArea
                    onChange = { onChangeDescription }
                    value={ Description }
                />

                <br />
                <br />

                <select onChange = { onPrivateChange }>

                    {/* map을 사용하면 key값을 부여해야한다*/}
                    
                    { PrivateOptions.map((item, index) => {
                       return <option key={ index } value={ item.value }>{ item.label }</option>
                    })}

                </select>
                
                <br />
                <br />  

                <select onChange= { onCategoryChange }>
                    { CategoryOptions.map((item, index) => (
                         <option key={index} value={item.lable}>{item.label}</option>
                    ))}
                </select>
                
                <br />
                <br />  

                <Button type="primary" size="large" onClick = { onSubmit }>
                        Submit
                </Button>

           </Form>
        </div>
    )
}

export default VideoUploadPage
