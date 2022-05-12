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
  echo -e "$RED✗ Fehler bei der Installation:$NORMAL Du benötigst Root-Rechte, um die Installation zu starten."
  exit
fi

# Check if installed
if [ -d $INSTALLATION_PATH ]; then
    echo -e "$YELLOW⚠ Fehler bei der Installation: $NORMAL MySpeed ist bereits auf diesem System installiert. (Pfad: $INSTALLATION_PATH)"
    exit 0
fi


# Update all packages
echo -e "$BLUE🔎 Status:$NORMAL Es wird nach neuen Updates für das Linux-System gesucht..."
apt-get update -y

clear
echo -e "$GREENℹ Info:$NORMAL Die Installation wird jetzt vorbereitet. Das kann einen Augenblick dauern..."
sleep 5
# Check for wget
clear
echo -e "$BLUE🔎 Status:$NORMAL Überprüfe, ob wget vorhanden ist..."
if ! command -v wget &> /dev/null
then
    echo -e "$YELLOWℹ \"wget\" ist nicht installiert.$NORMAL Die Installation wurde gestartet..."
    sleep 2
    apt-get install wget -y
fi

# Check for unzip
clear
echo -e "$BLUE🔎 Status:$NORMAL Überprüfe, ob unzip vorhanden ist..."
if ! command -v unzip &> /dev/null
then
    echo -e "$YELLOWℹ \"unzip\" ist nicht installiert.$NORMAL Die Installation wurde gestartet..."
    sleep 2
    apt-get install unzip -y
fi

# Check for curl
clear
echo -e "$BLUE🔎 Status:$NORMAL Überprüfe, ob curl vorhanden ist..."
if ! command -v curl &> /dev/null
then
    echo -e "$YELLOWℹ \"curl\" ist nicht installiert.$NORMAL Die Installation wurde gestartet..."
    sleep 2
    apt-get install curl -y
fi

# Check for node
clear
echo -e "$BLUE🔎 Status:$NORMAL Überprüfe, ob node vorhanden ist..."
if ! command -v node &> /dev/null
then
    echo -e "$YELLOWℹ \"node\" ist nicht installiert.$NORMAL Die Installation wurde gestartet..."
    sleep 2
    curl -sSL https://deb.nodesource.com/setup_16.x | bash
    apt-get install nodejs -y
fi

clear
RELEASE_URL=$(curl -s https://api.github.com/repos/gnmyt/myspeed/releases/latest | grep browser_download_url | cut -d '"' -f 4)
echo -e "$GREEN✓ Vorbereitung abgeschlossen:$NORMAL Die Installation von MySpeed wird jetzt gestartet..."
sleep 3

clear
if [ ! -d $INSTALLATION_PATH ]
then
    echo -e "$BLUEℹ Info: $NORMAL MySpeed wird unter dem Verzeichnis $INSTALLATION_PATH installiert. Der Ordner wird nun erstellt."
    sleep 2
    mkdir $INSTALLATION_PATH
fi

cd $INSTALLATION_PATH

echo -e "$BLUEℹ Info: $NORMAL Die aktuelle MySpeed-Instanz wird heruntergeladen. Einen Moment..."
sleep 2
wget "$RELEASE_URL"

echo -e "$BLUEℹ Info: $NORMAL Download abgeschlossen. Entpacken läuft..."
sleep 2
unzip MySpeed*.zip
rm MySpeed-*.zip

echo -e "$BLUEℹ Info: $NORMAL Die notwendigen Abhängigkeiten werden jetzt installiert..."
sleep 2
npm install

# Install as system service
clear
echo -e "$BLUE🔎 Status:$NORMAL Registriere MySpeed als Hintergrunddienst..."
if systemctl --all --type service | grep -q "myspeed.service"; then
  cat << EOF >> /etc/systemd/system/myspeed.service
  [Unit]
  Description=MySpeed
  After=network.target

  [Service]
  Type=simple
  ExecStart=/usr/bin/node server
  Restart=always
  User=root
  Environment=NODE_ENV=production
  WorkingDirectory=/opt/myspeed

  [Install]
  WantedBy=multi-user.target
EOF
  systemctl daemon-reload
  systemctl enable myspeed
  systemctl start myspeed
fi

systemctl status myspeed

clear
echo -e "$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-" #multicolor
echo -e "$GREEN✓ Installation abgeschlossen: $NORMAL MySpeed wurde unter $INSTALLATION_PATH installiert."
echo -e "Die Weboberfläche findest du im Browser unter$BLUE http://localhost:5216$NORMAL."
echo -e "$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-" #multicolor
# MySpeed is installed successfully.
