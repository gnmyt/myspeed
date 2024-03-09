import {Link} from "react-router-dom";
import "./styles.sass";

export const Footer = () => {
    return (
        <div className="footer">
            <p>© {new Date().getFullYear()} Mathias Wagner</p>

            <div className="legal-nav">
                <Link to="/imprint">Imprint</Link>
                <Link to="/privacy">Privacy Policy</Link>
            </div>
        </div>
    )
}