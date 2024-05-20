import {DONATION_URL, PROJECT_URL, WEB_URL} from "@/index";
import {Trans} from "react-i18next";


export const creditsInfo = () => <Trans components={{MSpeed: <a href={WEB_URL} target="_blank" />,
    Github: <a href={PROJECT_URL} target="_blank" />, Donate: <a href={DONATION_URL} target="_blank" />}}>info.credits</Trans>

export const recommendationsInfo = (ping, down, up) => <Trans components={{Bold: <span className="dialog-value" />}}
                                                              values={{ping, down, up}}>info.recommendations_info</Trans>