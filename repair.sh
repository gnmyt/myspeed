#!/usr/bin/env bash

# Colors for better overview
GREEN='\033[0;32m'
BLUE='\033[1;34m'
YELLOW='\033[1;33m'
RED='\033[1;31m'
NORMAL='\033[0;39m'

INSTALLATION_PATH="/opt/myspeed"

# Root check
if [ $EUID -ne 0 ]; then
  echo -e "$RED✗ Fehler bei der Reparatur:$NORMAL Du benötigst Root-Rechte, um die Reparatur starten zu können-"
  exit
fi

# Repair-Info
echo -e "$GREEN ---------$BLUE Automatische Reparatur$GREEN ---------" 
echo -e "$BLUE MySpeed$YELLOW wird repariert."
echo -e "$YELLOW Wenn du$RED abbrechen$YELLOW möchtest, kannst du die"
echo -e "$YELLOW Repararur mit$RED STRG + C$YELLOW abbrechen. "
echo -e "$GREEN Die Reparatur beginnt in 5 Sekunden..."
echo -e "$GREEN ----------------------------------------------"
sleep 5

clear
echo -e "$BLUE🔎 Status:$NORMAL Die Reparatur wird gestartet..."
sleep 2
clear
echo -e "$BLUE🔎 Status:$NORMAL Berechtigungen werden festgelegt..."
# setup permissions
chmod 700 /opt/myspeed
clear
echo -e "$BLUE🔎 Status:$NORMAL Es wird überprüft, ob Build Essantials installiert ist..."
sudo apt-get install build-essential
clear
echo -e "$BLUE🔎 Status:$NORMAL Umgebungsvariable wird geändert..."
# see in wiki Fehlerbehebung -> Cannot get /
export NODE_ENV=production
clear
echo -e "$BLUE🔎 Status:$NORMAL Module werden neu installiert..."
sleep 2
echo -e "$BLUE🔎 Status:$NORMAL Vorhandene Module werden entfernt..."
cd /
cd /opt/myspeed
rm -R node_modules
echo -e "$BLUE🔎 Status:$NORMAL Aktuelle Module werden installiert..."
echo -e "$YELLOW⚠ Hinweis:$NORMAL Beim Fortschritt zwischen 90% und 100% kann es hier für einige Zeit so aussehen, als würde es nicht mehr reagieren. Das ist ganz normal."
npm install
cd /
clear
echo -e "$BLUE🔎 Status:$NORMAL npm wird aktualisiert..."
curl https://www.npmjs.com/install.sh | sh
clear
echo -e "$BLUE🔎 Status:$NORMAL Es wird nach Updates für das Linux-System gesucht..."
sudo apt-get update
clear
echo -e "$BLUE🔎 Status:$NORMAL Vorhandene Updates werden installiert..."
sudo apt-get upgrade -y
clear
echo -e "$BLUE🔎 Status:$NORMAL MySpeed wird neu gestartet..."
sleep 2
systemctl restart myspeed 
clear
echo -e "$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-" #multicolor
echo -e "$GREEN✓ Fertig:$NORMAL Die Reparatur ist abgeschlossen."
echo -e "Die Weboberfläche sollte jetzt unter $BLUE http://$(curl -s ifconfig.me):5216$NORMAL erreichbar sein."
echo -e "$YELLOW⚠ Hinweis:$NORMAL Sollte das Problem immernoch nicht behoben sein, bitten wir dich eine Fehlermeldung unter$BLUE https://github.com/gnmyt/myspeed/issues$NORMAL zu erstellen."
echo -e "$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-" #multicolor
# MySpeed is repaired successfully or cannot repair a unknown problem.
