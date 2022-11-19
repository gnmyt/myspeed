import {Trans} from "react-i18next";
import {PROJECT_URL, PROJECT_WIKI} from "@/index";

export const updateInfo = (version) => <Trans values={{version}} components={{Changes: <a href={PROJECT_URL + "/releases/latest"} target="_blank"/>,
    DLLink: <a href={PROJECT_WIKI + "/setup/linux"} target="_blank"/>}}>info.update</Trans>