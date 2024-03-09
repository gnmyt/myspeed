import "./styles.sass";
import Logo from "@/common/assets/logo192.png";
import Button from "@/common/components/Button";
import {faBars, faBarsStaggered, faHeart} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useEffect, useState} from "react";

export const DONATION_LINK = "https://www.ko-fi.com/gnmyt";

export const Navigation = () => {
    const [mobileOpen, setMobileOpen] = useState(true);
    const [showScreen, setShowScreen] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setMobileOpen(false);
        }, 500);

        return () => clearTimeout(timeout);
    }, []);

    const onAnimationEnd = (event) => {
        if (event.animationName === "navClose") {
            setShowScreen(false);
        }
    }

    const openMenu = () => {
        setMobileOpen(true);
        setShowScreen(true);
    }

    return (
        <>
            <nav>
                <Link className="logo-area" to="/">
                    <img src={Logo} alt="Logo"/>
                    <h1>MySpeed</h1>
                </Link>
                <div className="nav-area">
                    <ul>
                        <li><Link to="/install">Install</Link></li>
                        <li><Link to="/tutorials">Tutorials</Link></li>
                        <li><Link to="https://myspeed.gnmyt.dev">Documentation</Link></li>
                    </ul>
                    <Button icon={faHeart} text="Donate" color="red"
                            onClick={() => window.open(DONATION_LINK, "_blank")}/>
                </div>
                <div className="mobile-toggle" onClick={openMenu}>
                    <FontAwesomeIcon icon={mobileOpen ? faBarsStaggered : faBars}/>
                </div>
            </nav>

            <div className={`mobile-nav ${mobileOpen ? "" : "mobile-nav-closed"}`}
                 onClick={() => setMobileOpen(false)} onAnimationEnd={onAnimationEnd}>
                <Link className={`logo${showScreen ? "" : " logo-pulse"}`} to="/">
                    <img src={Logo} alt="Logo"/>
                    <h1>MySpeed</h1>
                </Link>
                {showScreen && <>
                    <div className="mobile-links">
                        <Link to={"/install"}>Install</Link>
                        <Link to={"/tutorials"}>Tutorials</Link>
                        <Link to={"https://myspeed.gnmyt.dev"}>Documentation</Link>
                    </div>
                    <Button icon={faHeart} text="Donate" color="red"
                            onClick={() => window.open(DONATION_LINK, "_blank")}/>
                </>
                }
            </div>

        </>
    );
}