import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";


function SideVideo({ id }) {
  const [SideVideos, setSideVideos] = useState([]);

  useEffect(() => {
    Axios.get("/api/video/getVideos").then((res) => {
      if (res.data.success) {
        setSideVideos(res.data.database);
   
      } else {
        alert("Failed to get Videos");
      }
    });
  }, []);

  const renderSideVideo = SideVideos.map((video, index) => {
    const minutes = Math.floor(video.duration / 60);
    const seconds = Math.floor(video.duration - (minutes*60));
    
    if (id !== video._id) {
  
      return (
        <div
          key={ index }
          style={{ display: "flex", marginBottom: "1rem", padding: "0 2rem" }}
        >
          <div style={{ width: "40%", marginRight: "1rem" }}>
            {video && (
              <a href={`/video/post/${video._id}`}>
                <img
                  style={{ width: "100%", height: '100%' }}
                  src={`http://localhost:5000/${video.thumbnail}`}
                  alt="thumbnail"
                />
              </a>
            )}
          </div>

          <div style={{ width: "50%" }}>
            <a href style={{ color : 'gray'}}>
              <span style={{ fontSize: "1rem", color: "black" }}>
                {video.title}
              </span>
              <br />
              <span>{video.writer.name}</span>
              <br />
              <span>{video.views } views</span>
              <br />
              <span>{ minutes } : { seconds}</span>
            </a>
          </div>
        </div>
      );
    }
  });

  return (
        <React.Fragment >
            <div style={{ marginTop : '3rem'}} />
            {renderSideVideo}
        </React.Fragment>
    )
}

export default SideVideo;
