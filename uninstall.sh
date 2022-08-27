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
  echo -e "$RED✗ Fehler bei der Deinstallation:$NORMAL Du benötigst Root-Rechte, um die Deinstallation zu starten."
  exit
fi

echo -e "$GREEN ---------$BLUE Automatische Deinstallation$GREEN ---------"
echo -e "$BLUE MySpeed$YELLOW wird nun deinstalliert."
echo -e "$YELLOW Wenn du$RED abbrechen$YELLOW möchtest, kannst du die"
echo -e "$YELLOW Deinstallation mit$RED STRG + C$YELLOW abbrechen. "
echo -e "$GREEN Die Deinstallation beginnt in 5 Sekunden..."
echo -e "$GREEN ----------------------------------------------"
sleep 5

clear
echo -e "$BLUE🔎 Status:$NORMAL Die Servicedaten werden entfernt, falls vorhanden..."
sleep 3

# remove system file
if command -v systemctl &> /dev/null && systemctl --all --type service | grep -n "myspeed.service"; then
  systemctl stop myspeed
  systemctl disable myspeed
  rm /etc/systemd/system/myspeed.service
  rm /usr/lib/systemd/system/myspeed.service
  systemctl daemon-reload
  systemctl reset-failed
fi

clear
echo -e "$BLUE🔎 Status:$NORMAL Die MySpeed-Systemdaten werden entfernt, falls vorhanden..."
sleep 3

# remove folder
if [ "$1" == "--keep-data" ]; then
  mv $INSTALLATION_PATH/data /tmp/myspeed_data
  rm -R $INSTALLATION_PATH
  mkdir /opt/myspeed
  mv /tmp/myspeed_data $INSTALLATION_PATH/data
else
  rm -R $INSTALLATION_PATH
fi

clear
echo -e "$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-" #multicolor
echo -e "$GREEN✓ Fertig: $NORMAL MySpeed wurde deinstalliert."
echo -e "$NORMAL Du kannst MySpeed jederzeit wieder installieren. Die Anleitung dazu findest du auf myspeed.gnmyt.dev/setup/linux."
echo -e "$RED Danke, dass du MySpeed genutzt hast!"
echo -e "$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-" #multicolor
