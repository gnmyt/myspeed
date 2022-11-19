import {PROJECT_URL, PROJECT_WIKI} from "@/index";
import {Trans} from "react-i18next";
const HEALTHCHECKS_URL = "https://healthchecks.io/";
const CLI_URL = "https://www.speedtest.net/apps/cli";

export const healthChecksInfo = () => <Trans components={{HCLink: <a href={HEALTHCHECKS_URL} target="_blank"/>,
    WIKILink: <a href={PROJECT_WIKI + "/instructions/settings"} target="_blank"/>}}>info.healthchecks</Trans>

export const creditsInfo = () => <Trans components={{Link: <a href={PROJECT_URL} target="_blank" />,
    CLILink: <a href={CLI_URL} target="_blank"/>}}>info.credits</Trans>

export const recommendationsInfo = (ping, down, up) => <Trans components={{Bold: <span className="dialog-value" />}}
                                                              values={{ping, down, up}}>info.recommendations_info</Trans>