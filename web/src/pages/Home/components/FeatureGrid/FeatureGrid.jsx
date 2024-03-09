import "./styles.sass";

import LanguageFeature from "@/common/assets/feature/language.png";
import ViewsFeature from "@/common/assets/feature/views.png";
import IntegrationsFeature from "@/common/assets/feature/integrations.png";
import CronFeature from "@/common/assets/feature/cron.png";

export const TRANSLATIONS_LINK = "https://crowdin.com/project/myspeed";

export const FeatureGrid = () => {
    return (
        <div className="feature-grid-section">
            <div className="feature-grid-row">
                <div className="feature-box">
                    <img src={LanguageFeature} alt="Multilingual"/>
                    <h1>Multilingual</h1>
                    <p>MySpeed supports English, German and <a href={TRANSLATIONS_LINK} target="_blank">more languages</a>.</p>
                </div>
                <div className="feature-box">
                    <img src={ViewsFeature} alt="Multiple Views"/>
                    <h1>Multiple Views</h1>
                    <p>Choose between different views to display your data.</p>
                </div>
            </div>
            <div className="feature-grid-row">
                <div className="feature-box">
                    <img src={IntegrationsFeature} alt="Extensible"/>
                    <h1>Extensible</h1>
                    <p>You can integrate MySpeed in WhatsApp, Discord, HealthChecks or your own Webhook</p>
                </div>
                <div className="feature-box">
                    <img src={CronFeature} alt="Cron Jobs"/>
                    <h1>Choose your time</h1>
                    <p>Whether you want to check every 5 minutes or every 5 hours, MySpeed has you covered.</p>
                </div>
            </div>
        </div>
    )
}