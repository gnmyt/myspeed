# Fragen & Antworten
Hier beantworten wir dir die Fragen, die möglicherweise auftreten könnten.

??? question "Wie installiere ich MySpeed?"
    Du findest in der Seitenleiste unter "Einrichtung" das für dich passende Betriebsystem und eine Anleitung zur Installation.

??? question "Warum sollte ich Häufigkeiten konfigurieren?"
    Das kommt sehr stark auf dein Internet an. Hast du beispielsweise ein sehr schlechtes Internet, so solltest du die Häufigkeit eher verringern. Ist dein Internet recht schnell, kannst du diese vergrößern. Auf dieser Basis werden dann je nachdem mehr oder weniger Tests gemacht.  
    
    ???+ warning "Achtung"
        Es ist sehr wahrscheinlich, dass Hintergrunddienste deine Geschwindigkeiten beeinflussen. Schalte diese am besten bei den jeweiligen Testzeiten ab, da sonst dein Ergebnis manipuliert werden könnte.

??? question "Wie setze ich mein Passwort zurück?"
    Du hast dein MySpeed-Passwort vergessen? Das passiert, kein Problem. Zum zurücksetzen navigiere in den Installationsort (`cd /opt/myspeed`) und führe den folgenden Befehl aus:
    ```sh
    node -e "const db = require('better-sqlite3')('data/storage.db'); db.prepare('UPDATE config SET value = ? WHERE key = ?').run('none', 'password');"
    ```    
    Dann kannst du die Seite erneut aufrufen und dein Passwort manuell festlegen :)