# Fragen & Antworten
Hier beantworten wir dir die Fragen, die möglicherweise auftreten könnten.

??? question "Wie installiere ich MySpeed?"
    Je nach Betriebssystem ist diese Anleitung unterschiedlich. Hier findest du die Anleitung für [Windows](../setup/windows) und [Linux](../setup/linux).  
    Allerdings wird es stark empfohlen, MySpeed unter Linux zu installieren.

??? question "Was sind die Anforderungen?"
    Es kommt darauf an, was für eine Bandbreite du hast. Bei Linux wäre es zum Beispiel so:
    Wenn du ein Maximum von 100 Mbit/s anliegen hast, dann reicht ein RaspberryPi 1 oder ein anderer alter Computer.
    Wenn du eine Gbit-Leitung hast, wäre schon ein Raspberry Pi 4 oder ein PC mit 1Gbit LAN Support wichtig.

??? question "Kann ich trotz VPN MySpeed verwenden?"
    Solange du dein VPN Dienst nicht auf demselben System nutzt wie auf dem, wo MySpeed läuft, ist das kein Problem.
    Andernfalls kann dein VPN die Ergebnisse verfälschen bzw. nicht realistisch wiedergeben.

??? question "Dienen diese Informationen als offizieller Nachweis für meinen Internetanbieter?"
    Nein. Die Speedtests müssen dann eigenhändig vom Speedtest deines Anbieters ausgeführt werden.
    MySpeed dient in dem Fall nur zu Informationszwecken und hat keinerlei rechtliche Garantien.

??? question "Was kann die Speedtests beeinflussen?"
    Es gibt viele Faktoren, die die Geschwindigkeitstests beeinflussen können. Wenn Sie zum Beispiel viele Hintergrunddienste haben
    laufen, können diese die Ergebnisse beeinflussen. Am besten schalten Sie diese zu den jeweiligen Testzeiten ab, da sonst die
    Ergebnisse verfälscht werden könnten.

??? question "Was passiert mit den alten Testergebnissen?"
    Die alten Testergebnisse werden automatisch gelöscht, sobald sie älter als 30 Tage sind.

??? question "Muss es dauerhaft laufen?"
    Wir empfehlen es, um bessere Ergebnisse zu erhalten. Wenn es dich beim Filme streamen etc. stört, 
    kannst du es auch über die Weboberfläche für eine bestimmte Zeit oder manuell pausieren.
    Bei einem 24/7 Betrieb empfehlen wir ein System, das nicht viel Watt benötigt. In dem Fall empfehlen wir ein Raspberry Pi.
    Solltest du bereits einen Server immer laufen haben, kannst du es auch dort parallel laufen lassen.

??? question "Wie kann ich manuelle und automatische Speedtests unterscheiden?"
    Klicke bei dem jeweiligen Test auf das Uhrsymbol. Dort stehen alle Informationen zum Speedtest.

??? question "Zeigt die Funktion "Optimale Werte" meine korrekte Bandbreite an?"
    Nein, das ist ein gerechneter Wert von deinen 10 letzten Speedtests. Die verfügbare Bandbreite wird in deinem Anschlussvertrag zu finden sein.

??? question "Kann der Entwickler meine Testergebnisse einsehen?"
    Nein, die Testergebnisse sind nur lokal auf dem Server sichtbar.

??? question "Warum sollte ich Häufigkeiten konfigurieren?"
    Das kommt sehr stark auf dein Internet an. Hast du beispielsweise ein sehr schlechtes Internet, so solltest du die Häufigkeit eher verringern. Ist dein Internet recht schnell, kannst du diese vergrößern. Auf dieser Basis werden dann je nachdem mehr oder weniger Tests gemacht.  
    
    ???+ warning "Achtung"
        Es ist sehr wahrscheinlich, dass Hintergrunddienste deine Geschwindigkeiten beeinflussen. Schalte diese am besten bei den jeweiligen Testzeiten ab, da sonst dein Ergebnis manipuliert werden könnte.

??? question "Wie setze ich mein Passwort zurück?"
    Du hast dein MySpeed-Passwort vergessen? Das passiert, kein Problem. Zum Zurücksetzen navigiere in den Installationsort (`cd /opt/myspeed`) und führe den folgenden Befehl aus:
    ```sh
    node -e "const {Sequelize} = require('sequelize');const db = new Sequelize({dialect: 'sqlite', storage: 'data/storage.db'});db.query('UPDATE config SET value=? WHERE key=?', {replacements: ['none', 'password']})"
    ```    
    Dann kannst du die Seite erneut aufrufen und dein Passwort manuell festlegen :)
