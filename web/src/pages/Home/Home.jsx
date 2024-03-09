import InterfaceImage from "@/common/assets/interface.png";
import Logo from "@/common/assets/logo192.png";
import "./styles.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown, faArrowUp} from "@fortawesome/free-solid-svg-icons";
import Features from "@/pages/Home/components/Features";
import FeatureGrid from "@/pages/Home/components/FeatureGrid";
import GetStarted from "@/pages/Home/components/GetStarted";
import Footer from "@/pages/Home/components/Footer";


const COLORS = ["#45C65A", "#E58A00", "#EC5555"];

const chooseRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

export const Home = () => {
    return (
        <div className="home-page">

            <div className="info-area">
                <img src={Logo} alt="Logo" draggable={false}/>
                <div className="title-area">
                    <h1>MySpeed</h1>
                    <h2>Speedtest automation made simple</h2>
                </div>
            </div>

            {Array(5).fill(0).map((_, index) => (
                <div className="flying-icons" key={index}>
                    <FontAwesomeIcon icon={faArrowDown} style={{color: chooseRandomColor(),animationDelay: `${index * 0.5}s`}}/>
                    <FontAwesomeIcon icon={faArrowUp} style={{color: chooseRandomColor(),animationDelay: `${index * 0.5}s`}}/>
                </div>
            ))}

            <div className="interface-image">
                <img src={InterfaceImage} alt="Interface" draggable={false}/>
            </div>

            <Features />

            <FeatureGrid />

            <GetStarted />

            <Footer />
        </div>
    )
}