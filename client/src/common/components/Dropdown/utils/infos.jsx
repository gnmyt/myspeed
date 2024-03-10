import {WEB_URL} from "@/index";
import {Trans} from "react-i18next";
const CLI_URL = "https://www.speedtest.net/apps/cli";

export const creditsInfo = () => <Trans components={{Link: <a href={WEB_URL} target="_blank" />,
    CLILink: <a href={CLI_URL} target="_blank"/>}}>info.credits</Trans>

export const recommendationsInfo = (ping, down, up) => <Trans components={{Bold: <span className="dialog-value" />}}
                                                              values={{ping, down, up}}>info.recommendations_info</Trans>