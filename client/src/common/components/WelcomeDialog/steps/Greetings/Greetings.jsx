import Banner from "@/common/components/WelcomeDialog/banner.webp";
import "./styles.sass";
import {t} from "i18next";

export const Greetings = () => {
    return (
        <div className="welcome-greetings">
            <img src={Banner} alt="Welcome banner"/>
            <h2>{t("welcome.title")}</h2>
            <p>{t("welcome.subtext")}</p>
        </div>
    );
}