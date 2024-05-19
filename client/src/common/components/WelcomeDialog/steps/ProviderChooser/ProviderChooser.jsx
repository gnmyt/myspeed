import "./styles.sass";

import {providers} from "@/common/components/ProviderDialog/ProviderDialog";
import {t} from "i18next";

export const ProviderChooser = ({provider, setProvider}) => {
    return (
        <div className="provider-chooser">
            <h2>{t("welcome.provider_title")}</h2>
            <p>{t("welcome.provider_subtext")}</p>
            <div className="provider-list">
                {providers.map((current) => (
                    <div className={"provider-item" + (current.id === provider ? " provider-item-active" : "")}
                         onClick={() => setProvider(current.id)} key={current.id}>
                        <img src={current.image} alt={current.name}/>
                        <h2>{current.name}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
}