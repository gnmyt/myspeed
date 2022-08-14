export function getIconBySpeed(current, optional, higherIsBetter) {
    let speed = Math.floor((current / optional) * 100);

    if (current === -1) return "error";

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