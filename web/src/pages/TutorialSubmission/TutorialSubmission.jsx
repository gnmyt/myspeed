import "./styles.sass";
import Button from "@/common/components/Button/index.js";
import {faHome, faPaperPlane, faThumbtack} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const TutorialSubmission = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const typeParam = new URLSearchParams(location.search).get("type");

    const [type, setType] = useState(typeParam || "video");
    const [email, setEmail] = useState("");
    const [contentUrl, setContentUrl] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    const postTutorial = async (ev) => {
        ev.preventDefault();

        const response = await fetch("https://api.staticforms.xyz/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email, message: message, $type: type, $contentUrl: contentUrl,
                accessKey: "b2823f24-eaf7-467f-ae28-0eb350385cdd"
            })
        });

        if (response.ok) {
            setSuccess(true);
        } else {
            window.open("mailto:content@gnmyt.dev?subject=Tutorial Submission&body=Type: " + type + "%0D%0AEmail: " + email + "%0D%0AContent URL: " + contentUrl + "%0D%0AMessage: " + message, "_blank");
        }
    }

    return (
        <form className="tutorial-submission-page" onSubmit={postTutorial}>
            {success && <div className="submission-success">
                <h2>Thank you for your submission!</h2>
                <Button icon={faHome} text="Back to home" color="blue"
                        onClick={() => navigate("/")}/>
            </div>}
            {!success && <div className="submission-area">
                <h1>Submit a tutorial</h1>

                <input type="hidden" name="honeypot" style={{display: "none !important"}}/>
                <div className="input-group">
                    <label htmlFor="type">Type *</label>
                    <select id="type" value={type} onChange={(e) => setType(e.target.value)} name="type"
                            required>
                        <option value="video">Video</option>
                        <option value="blog">Blog</option>
                    </select>
                </div>

                <div className="input-group">
                    <label htmlFor="email">Email *</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
                           placeholder="Your email address" name="email" required/>
                </div>

                <div className="input-group">
                    <label htmlFor="content-url">Content URL *</label>
                    <input type="url" id="content-url" value={contentUrl}
                           onChange={(e) => setContentUrl(e.target.value)}
                           placeholder={"URL to your " + (type === "blog" ? "blog post" : "video") + " (e.g. " + (type === "blog" ? "https://example.com/blog-post" : "https://youtube.com/watch?v=example") + ")"}
                           name="content-url" required/>
                </div>

                <div className="input-group">
                    <label htmlFor="message">Message</label>
                    <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)}
                              placeholder="Anything you want to tell us?" name="message"/>
                </div>

                <Button icon={faPaperPlane} text="Submit tutorial" color="green"/>

            </div>}

            {!success && <div className="info-area">
                <div className="info-title">
                    <FontAwesomeIcon icon={faThumbtack}/>
                    <h1>Submission guidelines</h1>
                </div>

                <ul>
                    <li>You need to provide a valid email address so we can contact you if there are any issues with
                        your submission.
                    </li>
                    <li>The content URL should be a direct link to your content. In your case, this would be a link to
                        your {type === "blog" ? " blog post" : " video"}. This link should be publicly accessible.
                    </li>
                    <li>
                        Your content needs to be related to MySpeed. This can be a tutorial on how to use MySpeed, a
                        review, or anything else that is related to MySpeed.
                    </li>
                    <li>
                        You need to be the creator of the content you are submitting. If you are submitting someone
                        else's content, please ask them to submit it.
                    </li>
                </ul>

                <input type="checkbox" id="terms_read" required/>
                <label htmlFor="terms_read">I have read and understood the guidelines</label>

            </div>}

        </form>
    );
}
