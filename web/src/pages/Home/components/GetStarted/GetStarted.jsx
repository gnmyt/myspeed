import "./styles.sass";

import DocsLogo from "@/common/assets/logo_docs.png";
import Button from "@/common/components/Button/index.js";
import {faPlay} from "@fortawesome/free-solid-svg-icons";
import {Link, useNavigate} from "react-router-dom";
import {DOCUMENTATION_BASE} from "@/main.jsx";

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

            <Link to={DOCUMENTATION_BASE}><img src={DocsLogo} alt="Docs Logo" /></Link>
        </div>
    );
}