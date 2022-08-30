import {parseExpression} from "cron-parser";

// Parses cron as a locale string
export const parseCron = (cron) => {
    try {
        return parseExpression(cron).next().toDate().toLocaleString()
    } catch (e) {
        return <span className="icon-orange">Eingabe ungültig</span>;
    }
}

// Fixes the cron provided by the user
export const stringifyCron = (cron) => {
    try {
        return parseExpression(cron).stringify();
    } catch (e) {
        return null;
    }
}