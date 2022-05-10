#!/usr/bin/env bash

# Colors for better overview
GREEN='\033[0;32m'
BLUE='\033[1;34m'
YELLOW='\033[1;33m'
RED='\033[1;31m'
NORMAL='\033[0;39m'


INSTALLATION_PATH="/opt/myspeed"
RELEASE_URL=$(curl -s https://api.github.com/repos/gnmyt/myspeed/releases/latest | grep browser_download_url | cut -d '"' -f 4)

log () {
    printf "\033[0;34m$1\e[0m\n"
}

# Root check
if [ $EUID -ne 0 ]; then
  echo "$RED ✗ Fehler bei der Installation: $NORMAL Du benötigst Root-Rechte, um die Installation zu starten."
  echo "$BLUE Die Root-Abfrage wird ausgeführt, bitte gib das dazugehörige Passwort ein. Die Installation wird dann automatisch neu gestartet. Um abzubrechen, drücke STRG+C."
  sudo -s
  curl -sSL https://raw.githubusercontent.com/gnmyt/myspeed/release/install.sh | bash
  exit
fi

# Check if installed
if [ -d $INSTALLATION_PATH ]; then
    echo "$YELLOW ⚠ Fehler bei der Installation: $NORMAL MySpeed ist bereits auf diesem System installiert. ($INSTALLATION_PATH)"
    exit 0
fi


# Update all packages
apt-get update -y

clear
echo "$GREENℹ Info:$NORMAL Die Installation wird jetzt vorbereitet. Das kann einen Augenblick dauern..."
sleep 5
# Check for wget
clear
echo "$BLUE🔎 Status:$NORMAL Überprüfe, ob wget vorhanden ist..."
if ! command -v wget &> /dev/null
then
    echo "$YELLOWℹ\"wget\" ist nicht installiert.$NORMAL Die Installation wurde gestartet..."
    sleep 2
    apt-get install wget -y
fi

# Check for unzip
clear
echo "$BLUE🔎 Status:$NORMAL Überprüfe, ob unzip vorhanden ist..."
if ! command -v unzip &> /dev/null
then
    echo "$YELLOWℹ\"unzip\" ist nicht installiert.$NORMAL Die Installation wurde gestartet..."
    sleep 2
    apt-get install unzip -y
fi

# Check for curl
clear
echo "$BLUE 🔎 Status:$NORMAL Überprüfe, ob curl vorhanden ist..."
if ! command -v curl &> /dev/null
then
    echo "$YELLOWℹ\"curl\" ist nicht installiert.$NORMAL Die Installation wurde gestartet..."
    sleep 2
    apt-get install curl -y
fi

# Check for node
clear
echo "$BLUE 🔎 Status:$NORMAL Überprüfe, ob node vorhanden ist..."
if ! command -v node &> /dev/null
then
    echo "$YELLOWℹ\"node\" ist nicht installiert.$NORMAL Die Installation wurde gestartet..."
    sleep 2
    curl -sSL https://deb.nodesource.com/setup_16.x | bash
    apt-get install nodejs -y
fi

clear
echo "$GREEN✓ Vorbereitung abgeschlossen:$NORMAL Die Installation von MySpeed wird jetzt gestartet..."
sleep 5

clear
if [ ! -d $INSTALLATION_PATH ]
then
    echo "$BLUEℹ Info: $NORMAL MySpeed wird unter dem Verzeichnis $INSTALLATION_PATH installiert. Der Ordner wird nun erstellt."
    sleep 2
    mkdir $INSTALLATION_PATH
fi

cd $INSTALLATION_PATH

echo "$BLUEℹ Info: $NORMAL Die aktuelle MySpeed-Instanz wird heruntergeladen. Einen Moment..."
sleep 2
wget "$RELEASE_URL"

echo "$BLUEℹ Info: $NORMAL Download abgeschlossen. Entpacken läuft..."
sleep 2
unzip MySpeed*.zip
rm MySpeed-*.zip

echo "$BLUEℹ Info: $NORMAL Die notwendigen Abhängigkeiten werden jetzt installiert..."
sleep 2
npm install

clear
echo "$GREEN✓ Installation abgeschlossen: $NORMAL MySpeed wurde unter $INSTALLATION_PATH installiert."
echo "Die Weboberfläche findest du unter $BLUEhttp://localhost:5216$NORMAL."
