export const healthChecksInfo = <>MySpeed verwendet <a href="https://healthchecks.io/" target="_blank">Healthchecks</a>,
    um dich zu benachrichtigen, wenn dein Internet ausfällt. Um dies zu aktivieren, setze deine Ping URL in das Textfeld
    ein. Mehr dazu <a href="https://myspeed.gnmyt.dev/instructions/settings/" target="_blank">hier</a></>;

export const creditsInfo = <><a href="https://github.com/gnmyt/myspeed" target="_blank"
                                rel="noreferrer">MySpeed</a> wird von GNMYT bereitgestellt und verwendet die <a
    href="https://www.speedtest.net/apps/cli" target="_blank" rel="noreferrer">Speedtest-CLI</a> von Ookla.</>;

export const recommendationsError = <>Du musst mindestens 10 Tests machen, damit ein Durchschnitt ermittelt werden kann.
    Ob die Tests manuell oder automatisch durchgeführt wurden ist egal.</>;

export const recommendationsInfo = (ping, download, upload) => <>Anhand der letzten 10 Testergebnisse wurde
    festgestellt, dass der optimale Ping bei <span className="dialog-value">{ping} ms</span>, der Download bei <span
        className="dialog-value">{download} Mbit/s </span>und der Upload bei <span
        className="dialog-value">{upload} Mbit/s</span> liegt. <br/>Orientiere dich am besten an deinem Internetvertrag
    und übernehme es nur, wenn es mit dem übereinstimmt.</>;