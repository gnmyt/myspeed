import "./styles.sass";
import Screenshot1 from "@/common/assets/sc1.png";
import Screenshot2 from "@/common/assets/sc2.png";


export const Features = () => {
    return (
        <div className="feature-area">
            <div className="feature">
                <img src={Screenshot1} alt="Screenshot - What is MySpeed?"/>
                <div className="feature-content">
                    <h1>What is MySpeed?</h1>
                    <p>MySpeed is a Software that helps you keeping track of your network speed. <br/><br/>It
                        automatically creates speedtests based on your schedule and displays them in a list.</p>
                </div>
            </div>

            <div className="feature feature-reverse">
                <img src={Screenshot2} alt="Screenshot - Detailed statistics"/>
                <div className="feature-content">
                    <h1>Detailed statistics</h1>
                    <p>MySpeed provides you with detailed statistics about your network speed. <br/><br/>This
                        includes data about your download and upload speed, as well as your ping.</p>
                </div>
            </div>

        </div>
    )
}