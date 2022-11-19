import {t} from "i18next";

export const errors = () => ({
    "Network unreachable": t("errors.network_unreachable"),
    "Timeout occurred in connect": t("errors.took_too_long"),
    "permission denied": t("errors.no_permission"),
    "Resource temporarily unavailable": t("errors.resource_unavailable"),
    "No route to host": t("errors.no_route"),
    "Connection refused": t("errors.connection_refused"),
    "timed out": t("errors.timed_out"),
    "Could not retrieve or read configuration": t("errors.config"),
});