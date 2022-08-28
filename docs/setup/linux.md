# Einrichtung Linux
Hier wird die Einrichtung für Linux beschrieben. MySpeed lässt sich über verschiedene Wege installieren.

## Installation mit Docker
!!! help "Hilfe"
    Du weißt nicht wie man Docker installiert? Dann schau dir mal [diese Anleitung](https://docs.docker.com/engine/install/#server) an

=== "Stabile Version"
    ```sh
    docker run -d -p 5216:5216 -v myspeed:/myspeed/data --restart=unless-stopped --name MySpeed germannewsmaker/myspeed
    ```

=== "Entwicklungsversion"
    ```sh
    docker run -d -p 5216:5216 -v myspeed:/myspeed/data --restart=unless-stopped --name MySpeed germannewsmaker/myspeed:development
    ```

## Automatische Installation
!!! tip "Tipp"
    Du möchtest MySpeed unter einem bestimmten Pfad installieren? Dann setze doch einfach den Parameter `-d /dein/installations/pfad` hinter den Befehl

=== "Stabile Version"
    ```sh
    curl -sSL https://raw.githubusercontent.com/gnmyt/myspeed/development/install.sh | bash -s --
    ```

=== "Entwicklungsversion"
    ```sh
    curl -sSL https://raw.githubusercontent.com/gnmyt/myspeed/development/install.sh | bash -s -- --beta
    ```

## Automatischer Deinstallationsprozess
Keine Lust mehr? Du kannst MySpeed ganz einfach wieder entfernen. Entscheide hier, ob du deine Daten behalten oder löschen möchtest.

!!! warning "Führe diese Befehle mit Bedacht aus"
    Das Ausführen der Befehle führt zur Löschung / Deinstallation von MySpeed. Sei dir bitte dessen bewusst.

=== "Daten behalten"
    ```sh
    curl -sSL https://raw.githubusercontent.com/gnmyt/myspeed/development/uninstall.sh | bash -s -- --keep-data
    ```

=== "Daten löschen"
    ```sh
    curl -sSL https://raw.githubusercontent.com/gnmyt/myspeed/development/uninstall.sh | bash
    ```

## Manuelle Installation
```sh
sudo apt-get install wget curl unzip -y #(1)

# Dies brauchst du nur ausführen, wenn du NodeJS noch nicht installiert hast
curl -sSL https://deb.nodesource.com/setup_16.x | bash
sudo apt-get install nodejs -y #(2)

mkdir /opt/myspeed && cd /opt/myspeed #(3)

wget $(curl -s https://api.github.com/repos/gnmyt/myspeed/releases/latest | grep browser_download_url | cut -d '"' -f 4) #(4)

unzip MySpeed-*.zip && rm MySpeed-*.zip #(5)

npm install #(6)

NODE_ENV=production node server #(7)
```

1. Hier installierst du alle notwendigen Pakete, um das Projekt zu installieren.
2. Dieser Schritt installiert die neuste Version von NodeJS.
3. Erstelle nun den Ordner, in welchen du MySpeed installieren möchtest. In diesem Fall ist das der Ordner `/opt/myspeed`.
4. Jetzt installierst du dir die neuste Version von MySpeed.
5. Nun entpackst du die gerade heruntergeladene Datei (dann kannst du sie löschen)
6. Installiere nun alle Abhängigkeiten.
7. Jetzt wird MySpeed gestartet. MySpeed ist nun unter dem Port 5216 erreichbar. 
   Wenn du planst, MySpeed im Hintergrund laufen zu lassen, dann schau dir den Guide dafür unten an.

## MySpeed vom Source-Code installieren
!!! warning "Achtung"
    Dieser Prozess installiert die neuste Entwicklungsversion von MySpeed. Fehler können auftreten.

```sh
sudo apt-get install git curl -y #(1)

# Dies brauchst du nur ausführen, wenn du NodeJS noch nicht installiert hast
curl -sSL https://deb.nodesource.com/setup_16.x | bash
sudo apt-get install nodejs -y #(2)

mkdir /opt/myspeed && cd /opt/myspeed #(3)

git clone https://github.com/gnmyt/myspeed.git . #(4)

npm install #(5)

cd client && npm install && npm run build && cd .. && mv client/build . #(6)

NODE_ENV=production node server #(7)
```

1. Hier installierst du alle notwendigen Pakete, um das Projekt zu installieren.
2. Dieser Schritt installiert die neuste Version von NodeJS.
3. Erstelle nun den Ordner, in welchen du MySpeed installieren möchtest. In diesem Fall ist das der Ordner `/opt/myspeed`.
4. Klone nun das MySpeed Repository, um Zugriff auf den Code zu erhalten.
5. Installiere nun alle Abhängigkeiten des Servers.
6. Jetzt kompilierst du die Oberfläche von MySpeed und verschiebst sie in den Ordner wo MySpeed sie lesen kann.
7. Jetzt wird MySpeed gestartet. MySpeed ist nun unter dem Port 5216 erreichbar.
   Wenn du planst, MySpeed im Hintergrund laufen zu lassen, dann schau dir den Guide dafür unten an.


## MySpeed 24/7 installieren
!!! warning "Wichtig"
    Du hast das Installationsskript verwendet? Dann brauchst du diesen Schritt gar nicht mehr ausführen.

Die Installation als Systemdienst ist gar nicht mal so schwer. In diesem Fall nutzen wir `systemd`, weil es direkt in den meisten Linux-Distributionen integriert ist.

1. Erstelle eine Datei mit dem Namen `myspeed.service` unter `/etc/systemd/system`. Hier verwenden wir `nano`
   ```sh
   nano /etc/systemd/system/myspeed.service
   ```

2. Füge nun den Inhalt der Datei ein.
   ```ini linenums="1"
   [Unit]
   Description=MySpeed
   After=network.target

   [Service]
   Type=simple
   ExecStart=/usr/bin/node server
   Restart=always
   # \/ Es wird stark empfohlen, einen eigenen Nutzer hier zu erstellen
   User=root
   Environment=NODE_ENV=production
   # \/ Gib hier deinen Installationsort an
   WorkingDirectory=/opt/myspeed 

   [Install]
   WantedBy=multi-user.target
   ```

3. Speicher die Datei ab. Das variiert je nach Editor ein wenig

    === "Nano"
        `STRG` + `X`, dann `Y` und dann `Enter`
    === "Vim"
        Drücke `ESC`, gib dann `:wq` ein und drücke `Enter`

4. Lade nun systemd neu  
   ```sh 
    systemctl daemon-reload
   ```

5. Wenn du möchtest, dass MySpeed beim Systemstart hochfährt, gib diesen Befehl ein:  
   ```sh
   systemctl enable myspeed
   ```

6. Fertig! Nun kannst du MySpeed endlich starten.  
   ```sh
   systemctl start myspeed
   ```

7. Überprüfe jetzt noch am besten den Status von MySpeed  
   ```sh
   systemctl status myspeed
   ```
