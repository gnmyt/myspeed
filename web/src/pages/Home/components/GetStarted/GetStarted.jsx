import "./styles.sass";

import DocsLogo from "@/common/assets/logo_docs.png";
import Button from "@/common/components/Button/index.js";
import {faPlay} from "@fortawesome/free-solid-svg-icons";
import {Link, useNavigate} from "react-router-dom";

export const GetStarted = () => {
    const navigate = useNavigate();
    return (
        <div className="get-started">
            <div className="start-info">
                <h1>Convinced?</h1>
                <h2>Great! Press the button below to get started.</h2>
                <Button text="Get Started" icon={faPlay} color="blue"
                        onClick={() => navigate("/install")} />
            </div>

            <Link to="https://myspeed.gnmyt.dev"><img src={DocsLogo} alt="Docs Logo" /></Link>
        </div>
    );
}