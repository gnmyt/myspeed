import "./styles.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBookOpenReader,
    faChalkboardTeacher,
    faNewspaper,
    faPaperPlane,
    faPlay,
    faVideo
} from "@fortawesome/free-solid-svg-icons";

import Videos from "./sources/videos.jsx";
import BlogPosts from "./sources/blog_posts.jsx";
import {useNavigate} from "react-router-dom";

export const Tutorials = () => {
    const navigate = useNavigate();

    return (
        <div className="tutorial-page">
            <div className="page-title">
                <FontAwesomeIcon icon={faChalkboardTeacher}/>
                <h1>Tutorials</h1>
            </div>

            <div className="tutorial-section">
                <FontAwesomeIcon icon={faVideo}/>
                <h2>Videos</h2>
            </div>

            <div className="tutorial-grid">
                {Videos.map((video, index) => (
                    <div key={index} className="tutorial-card"
                         onClick={() => window.open(video.link, "_blank")}>
                        <img src={video.thumb} alt={video.title} className="thumbnail"/>
                        <img src={video.creator} alt={video.title} className="creator"/>
                        <FontAwesomeIcon icon={faPlay} className="open_btn"/>
                    </div>
                ))}
                <div className="content-card" onClick={() => navigate("/tutorials/submit?type=video")}>
                    <FontAwesomeIcon icon={faPaperPlane} className="open_btn"/>
                </div>
            </div>

            <div className="tutorial-section">
                <FontAwesomeIcon icon={faNewspaper}/>
                <h2>Blog-Posts</h2>
            </div>

            <div className="tutorial-grid">
                {BlogPosts.map((video, index) => (
                    <div key={index} className="tutorial-card"
                         onClick={() => window.open(video.link, "_blank")}>
                        <img src={video.thumb} alt={video.title} className="thumbnail"/>
                        <img src={video.creator} alt={video.title} className="creator"/>
                        <FontAwesomeIcon icon={faBookOpenReader} className="open_btn"/>
                    </div>
                ))}
                <div className="content-card" onClick={() => navigate("/tutorials/submit?type=blog")}>
                    <FontAwesomeIcon icon={faPaperPlane} className="open_btn"/>
                </div>
            </div>
        </div>
    );
}