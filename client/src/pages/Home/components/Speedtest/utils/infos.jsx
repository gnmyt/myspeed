import React from "react";

export const averageResultDialog = (timeString, props) => <><span className="dialog-value">{props.amount}</span> Tests haben
    ergeben, dass am <span className="dialog-value">{timeString}</span> eine durchschnittliche Downloadgeschwindigkeit
    von <span className="dialog-value">{props.down} Mbit/s</span> und eine Upload-geschwindigkeit von <span
        className="dialog-value">{props.up} Mbit/s</span> bestand. Die Tests dauerten im Durchschnitt <span
        className="dialog-value">{props.duration} Sekunden</span>.</>;

export const resultDialog = (props) => <>Dieser Test erreichte eine maximale Downloadgeschwindigkeit von <span
    className="dialog-value">{props.down} Mbit/s </span>und eine maximale Uploadgeschwindigkeit von <span
    className="dialog-value">{props.up} Mbit/s</span>. Er wurde <span
    className="dialog-value">{props.type === "custom" ? "von dir" : "automatisch"}</span> angelegt und hat <span
    className="dialog-value">{props.duration} Sekunden</span> gedauert.</>