import { DialogContext, DialogProvider } from "@/common/contexts/Dialog";
import "./styles.sass";
import { useContext, useState } from "react";
import Greetings from "./steps/Greetings";
import ProviderChooser from "./steps/ProviderChooser";
import DataHelper from "./steps/DataHelper";
import OoklaLicense from "./steps/OoklaLicense";
import {patchRequest} from "@/common/utils/RequestUtil";
import {ConfigContext} from "@/common/contexts/Config";
import {t} from "i18next";

export const Dialog = () => {
    const close = useContext(DialogContext);

    const [config, reloadConfig] = useContext(ConfigContext);

    const [step, setStep] = useState(1);
    const [provider, setProvider] = useState("ookla");

    const [ping, setPing] = useState(parseInt(config.ping) || 0);
    const [download, setDownload] = useState(parseInt(config.download) || 0);
    const [upload, setUpload] = useState(parseInt(config.upload) || 0);
    const [animating, setAnimating] = useState(false);

    const finish = async () => {
        await patchRequest("/config/provider", {value: provider});

        if (config.previewMode) {
            localStorage.setItem("welcomeShown", "true");
        } else {
            await patchRequest("/config/ping", {value: ping});
            await patchRequest("/config/download", {value: download});
            await patchRequest("/config/upload", {value: upload});
        }

        reloadConfig();

        close(true);
    }

    const continueStep = () => {
        if (step === (provider === "ookla" ? 4 : 3)) {
            finish();
        } else {
            setAnimating(true);
            setStep(step + 1);
            setTimeout(() => {
                setAnimating(false);
            }, 500);
        }
    }

    return (
        <>
            <div className="welcome-banner">
                <div className={`welcome-inner ${animating ? 'slide-in' : ''}`}>
                    {step === 1 && <Greetings />}
                    {step === 2 && <ProviderChooser provider={provider} setProvider={setProvider} />}
                    {step === 3 && <DataHelper ping={ping} setPing={setPing} download={download}
                                               setDownload={setDownload} upload={upload} setUpload={setUpload} />}
                    {step === 4 && provider === "ookla" && <OoklaLicense />}
                </div>
                <div className="welcome-actions">
                    <h3>{t("welcome.step")} {step}/{provider === "ookla" ? 4 : 3}</h3>
                    <button className="dialog-btn" onClick={continueStep}>
                        {step === (provider === "ookla" ? 4 : 3) ? t("dialog.done") : t("dialog.continue")}
                    </button>
                </div>
            </div>
        </>
    )
}

export const WelcomeDialog = (props) => {
    return (
        <>
            <DialogProvider close={props.onClose} disableClosing={true}>
                <Dialog />
            </DialogProvider>
        </>
    )
}
