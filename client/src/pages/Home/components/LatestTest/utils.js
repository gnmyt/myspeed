export function generateRelativeTime(created) {
    let currentDate = new Date().getTime();
    let date = new Date(Date.parse(created)).getTime();

    const diff = (currentDate - date) / 1000;

    if (diff < 5) {
        return "Gerade eben"
    } else if (diff < 60) {
        return diff === 1 ? "1 Sekunde" : `${Math.floor(diff)} Sekunden`
    } else if (diff < 3600) {
        return Math.floor(diff / 60) === 1 ? "1 Minute" : `${Math.floor(diff / 60)} Minuten`
    } else if (diff < 86400) {
        return Math.floor(diff / 3600) === 1 ? "1 Stunde" : `${Math.floor(diff / 3600)} Stunden`
    }

    return "N/A"
}