# Fragen & Antworten

Hier beantworten wir die Fragen, die Sie haben könnten.

::: details Wie installiere ich MySpeed?
Je nach Betriebssystem sind diese Anweisungen unterschiedlich. Hier finden Sie die Anweisungen für [Windows](setup/windows) und [Linux](setup/linux).
Es wird jedoch dringend empfohlen, MySpeed unter Linux zu installieren.
:::

::: details Was sind die Anforderungen?
Es hängt davon ab, welche Art von Bandbreite Sie haben. Für Linux könnte es so aussehen:
Wenn Sie maximal 100 Mbps haben, reicht ein Raspberry Pi 1 oder ein anderer alter Computer aus.
Bei einer Gbit-Leitung sind ein Raspberry Pi 4 oder ein PC mit 1Gbit LAN-Unterstützung wichtig.
:::

::: details Kann ich MySpeed trotz VPN verwenden?
Solange Sie Ihren VPN-Dienst nicht auf dem gleichen System verwenden, auf dem MySpeed läuft, gibt es kein Problem.
Andernfalls könnten Ihre VPN-Einstellungen die Ergebnisse verzerren oder diese nicht realistisch widerspiegeln.
:::

::: details Dient diese Information als offizieller Nachweis für meinen ISP?
Nein. Die Geschwindigkeitstests müssen vom Geschwindigkeitstestdienst Ihres Anbieters durchgeführt werden.
In diesem Fall dient MySpeed nur zu Informationszwecken und bietet keine rechtliche Garantie.
:::

::: details Was kann die Geschwindigkeitstests beeinflussen?
Es gibt viele Faktoren, die die Geschwindigkeitstests beeinflussen können. Zum Beispiel können Hintergrunddienste
die Ergebnisse beeinflussen. Es ist am besten, sie während der jeweiligen Testzeiten auszuschalten, da sonst Ihre
Ergebnisse manipuliert werden könnten.
:::

::: details Was passiert mit den alten Testergebnissen?
Die alten Testergebnisse werden automatisch gelöscht, sobald sie älter als 30 Tage sind.
:::

::: details Muss MySpeed dauerhaft laufen?
Wir empfehlen es, um bessere Ergebnisse zu erzielen. Wenn es Sie beim Streamen von Filmen usw. stört,
können Sie es über die Web-Schnittstelle für eine bestimmte Zeit pausieren oder manuell anhalten.
Für den 24/7-Betrieb empfehlen wir ein System, das nicht viel Strom verbraucht. In diesem Fall empfehlen wir einen Raspberry Pi.
Wenn Sie bereits einen Server haben, der ständig läuft, können Sie es auch dort parallel laufen lassen.
:::

::: details Wie kann ich zwischen manuellen und automatischen Geschwindigkeitstests unterscheiden?
Klicken Sie auf das Uhrsymbol des jeweiligen Tests. Dort finden Sie alle Informationen zum Geschwindigkeitstest.
:::

::: details Zeigt die "Empfehlungen"-Funktion meine tatsächliche Bandbreite an?
Nein, dies ist ein berechneter Wert aus Ihren letzten 10 Geschwindigkeitstests. Die verfügbare Bandbreite finden Sie in Ihrem Vertragsangebot.
:::

::: details Kann der Entwickler meine Testergebnisse sehen?
Nein, die Testergebnisse sind nur lokal auf dem Server sichtbar.
:::

::: details Warum sollte ich Frequenzen konfigurieren?
Es hängt stark von Ihrem Internet ab. Wenn Sie z.B. eine sehr schlechte Internetverbindung haben, sollten Sie die Frequenz eher verringern.
Wenn Ihr Internet jedoch recht schnell ist, können Sie sie erhöhen. Auf dieser Grundlage werden mehr oder weniger Tests je nach Situation durchgeführt.

::: warning Achtung
Es ist sehr wahrscheinlich, dass Hintergrunddienste Ihre Geschwindigkeiten beeinflussen. Es ist am besten, sie während der jeweiligen Testzeiten auszuschalten, da sonst Ihre Ergebnisse manipuliert werden könnten.
:::

::: details Wie setze ich mein Passwort zurück?
Sie haben Ihr MySpeed-Passwort vergessen? Kein Problem. Um es zurückzusetzen, navigieren Sie zum Installationsort (`cd /opt/myspeed`) und führen Sie den folgenden Befehl aus:

```sh
node -e "const {Sequelize} = require('sequelize');const db = new Sequelize({dialect: 'sqlite', storage: 'data/storage.db'});db.query('UPDATE config SET value=? WHERE key=?', {replacements: ['none', 'password']})"
```    

Dann können Sie die Seite erneut aufrufen und Ihr Passwort manuell setzen :)
:::