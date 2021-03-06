#!/usr/bin/env bash

# Colors for better overview
GREEN='\033[0;32m'
BLUE='\033[1;34m'
YELLOW='\033[1;33m'
RED='\033[1;31m'
NORMAL='\033[0;39m'
PURPLE='\033[0;35m'


INSTALLATION_PATH="/opt/myspeed"

# Root check
if [ $EUID -ne 0 ]; then
  echo -e "$RED✗ Fehler bei der Installation:$NORMAL Du benötigst Root-Rechte, um die Installation zu starten."
  exit
fi

echo -e "$GREEN ---------$BLUE Automatische Installation$GREEN ---------"
echo -e "$BLUE MySpeed$YELLOW wird nun installiert."
if [ "$1" == "--beta" ]; then
  echo -e "$YELLOW Version:$BLUE MySpeed$PURPLE Beta"
else
  echo -e "$YELLOW Version:$BLUE MySpeed Release"
fi
echo -e "$YELLOW Es wird die Speedtest API von Ookla verwendet."
echo -e "$YELLOW Wenn du damit$RED nicht$YELLOW einverstanden bist,"
echo -e "$YELLOW kannst du die Installation mit$RED STRG + C$YELLOW abbrechen. "
echo -e "$GREEN Die Installation beginnt in 5 Sekunden..."
echo -e "$GREEN ----------------------------------------------"
sleep 5
clear

# Check if installed
if [ -d $INSTALLATION_PATH ]; then
    echo -e "$YELLOW⚠ Warnung: $NORMAL MySpeed ist bereits auf diesem System installiert."
    echo -e "$GREENℹ Info:$NORMAL Es wird nun der aktuelle Release installiert..."
    sleep 5
fi

if command -v systemctl &> /dev/null && systemctl --all --type service | grep -n "myspeed.service"; then
  systemctl stop myspeed
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

# Check for build essential
clear
if [ "$1" == "--beta" ]; then
  echo -e "$BLUE🔎 Status:$NORMAL Überprüfe, ob build-essential vorhanden ist..."
  if ! dpkg-query -l build-essential | grep build-essential &> /dev/null
  then
      echo -e "$YELLOWℹ \"build-essential\" ist nicht installiert.$NORMAL Die Installation wurde gestartet..."
      sleep 2
      apt-get install build-essential -y
  fi
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

if [ "$1" == "--beta" ]; then
  RELEASE_URL=https://github.com/gnmyt/myspeed/archive/refs/heads/development.zip
else
  RELEASE_URL=$(curl -s https://api.github.com/repos/gnmyt/myspeed/releases/latest | grep browser_download_url | cut -d '"' -f 4 | grep -m1 "")
fi


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
if [ "$1" == "--beta" ]; then
  unzip -qo development.zip
  rm -R server client
  mv myspeed-*/* .
  rm development.zip
  rm -R myspeed-development
else
  unzip -qo MySpeed*.zip
  rm MySpeed-*.zip
fi


echo -e "$BLUEℹ Info: $NORMAL Die notwendigen Abhängigkeiten werden jetzt installiert..."
sleep 2
npm install --force

if [ "$1" == "--beta" ]; then
  echo -e "$BLUEℹ Info: $NORMAL Die Weboberfläche wird kompiliert..."
  sleep 2
  cd client && npm install --force
  cd .. && npm run build
  cp -r client/build .
  rm -rf client/build
fi

# Install as system service
clear
echo -e "$BLUE🔎 Status:$NORMAL Registriere MySpeed als Hintergrunddienst..."
if command -v systemctl &> /dev/null && ! systemctl --all --type service | grep -n "myspeed.service"; then
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

clear

if ! command -v systemctl &> /dev/null; then
    echo -e "$YELLOW⚠ Warnung: $NORMAL Dein Linux-System bietet derzeit nicht die Möglichkeit, MySpeed im Hintergrund zu starten. Hierfür wird \"systemd\" benötigt."
    echo -e "$BLUEℹ Info: $NORMAL Du kannst, wenn du \"systemd\" installiert hast, die Installation erneut starten. Es wird dann automatisch eingestellt."
    sleep 5
else
  systemctl restart myspeed
fi

echo -e "$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-" #multicolor
echo -e "$GREEN✓ Installation abgeschlossen: $NORMAL MySpeed wurde unter $INSTALLATION_PATH installiert."
echo -e "Die Weboberfläche findest du im Browser unter$BLUE http://$(curl -s ifconfig.me):5216$NORMAL."
if [ -d $INSTALLATION_PATH ]; then
  echo -e "$BLUEℹ Info:$NORMAL Sollte das Update nicht erfolgreich angewendet worden sein, bitte starte MySpeed mal neu:$BLUE systemctl restart myspeed"
fi
echo -e "$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-" #multicolor
# MySpeed is installed successfully.
