export function generateRelativeTime(created) {
    let currentDate = new Date().getTime();
    let date = new Date(Date.parse(created)).getTime();

    const diff = (currentDate - date) / 1000;

    if (diff < 5) {
        return "Gerade eben"
    } else if (diff < 60) {
        return diff === 1 ? "Einer Sekunde" : `${Math.floor(diff)} Sekunden`
    } else if (diff < 3600) {
        return Math.floor(diff / 60) === 1 ? "Einer Minute" : `${Math.floor(diff / 60)} Minuten`
    } else if (diff < 86400) {
        return Math.floor(diff / 3600) === 1 ? "Einer Stunde" : `${Math.floor(diff / 3600)} Stunden`
    }

    return "Einer langen Zeit"
}

export function getIconBySpeed(current, optional, higherIsBetter) {
    let speed = Math.floor((current / optional) * 100);

    if (current === 0) return "error";

    if (higherIsBetter) {
        if (speed >= 75) return "green";
        if (speed >= 30) return "orange";
        return "red";
    } else {
        if (speed >= 180) return "red";
        if (speed >= 130) return "orange";
        return "green";
    }
}