#!/usr/bin/env bash

# Colors for better overview
GREEN='\033[0;32m'
BLUE='\033[1;34m'
YELLOW='\033[1;33m'
RED='\033[1;31m'
NORMAL='\033[0;39m'
PURPLE='\033[0;35m'

INSTALLATION_PATH="/opt/myspeed"

while getopts "d:" o > /dev/null 2>&1; do
    # shellcheck disable=SC2220
    case "${o}" in
        d) INSTALLATION_PATH=${OPTARG} ;;
    esac
done

# Root check
if [ $EUID -ne 0 ]; then
  echo -e "$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-"
  echo -e "$RED✗ ABGEBROCHEN"
  echo -e "$NORMAL Die Installation läuft derzeit über einen Benutzer ohne Root-Rechte. Dies ist allerdings erforderlich. Melde dich mit einem Root Account an, um fortzufahren."
  echo -e "$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-"
  exit
fi

echo -e "$GREEN ---------$BLUE Automatische Installation$GREEN ---------"
echo -e "$BLUE MySpeed$YELLOW wird nun installiert."
if [ "$1" == "--beta" ]; then
  echo -e "$YELLOW Version:$BLUE MySpeed$PURPLE Beta"
else
  echo -e "$YELLOW Version:$BLUE MySpeed Release"
fi
echo -e "$YELLOW Ort:$BLUE $INSTALLATION_PATH"
echo -e "$YELLOW Es wird die Speedtest API von Ookla verwendet."
echo -e "$YELLOW Wenn du damit$RED nicht$YELLOW einverstanden bist,"
echo -e "$YELLOW kannst du die Installation mit$RED STRG + C$YELLOW abbrechen. "
echo -e "$GREEN Die Installation beginnt in 10 Sekunden..."
echo -e "$GREEN ----------------------------------------------"
sleep 10
clear

# Check if installed
if [ -d "$INSTALLATION_PATH" ]; then
    clear
    echo -e "$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-"
    echo -e ""
    echo -e "$YELLOW⚠ WARNUNG"
    echo -e "$NORMAL MySpeed ist bereits auf diesem System installiert."
    echo -e ""
    echo -e "$GREENℹ Info:$NORMAL Neuestes Update wird installiert..."
    echo -e ""
    echo -e "$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-"
    sleep 5
fi

if command -v systemctl &> /dev/null && systemctl --all --type service | grep -n "myspeed.service"; then
  clear
  echo -e "$YELLOWℹ MySpeed Dienst wird gestoppt..."
  systemctl stop myspeed
fi


# Update all packages
clear
echo -e ""
echo -e "$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-"
echo -e ""
echo -e "$BLUE🔎 STATUSMELDUNG"
echo -e "$NORMAL Update-Suche für Linux-System gestartet..."
echo -e ""
echo -e "$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-"
echo -e ""
apt-get update -y

clear
echo -e "$GREENℹ Info:$NORMAL Die Installation wird jetzt vorbereitet. Das kann einen Augenblick dauern..."
sleep 5

function check() {
  clear
  echo -e "$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-"
  echo -e "$BLUE🔎 STATUSMELDUNG"
  echo -e "$NORMAL Es wird überprüft, ob $1 vorhanden ist..."
  echo -e "$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-"
  echo -e ""
  if ! command -v "$1" &> /dev/null
  then
      echo -e "$YELLOWℹ \"$1\" ist nicht installiert.$NORMAL Die Installation wird gestartet..."
      sleep 2
      echo -e "$PURPLEℹ Wird installiert..."
      apt-get install "$1" -y
  fi
}

check "wget"
check "unzip"
check "curl"

# Check for node
clear
echo -e "$BLUE🔎 STATUSMELDUNG"
echo -e "$NORMAL Es wird überprüft, ob node vorhanden ist..."
if ! command -v node &> /dev/null
then
    echo -e "$YELLOWℹ \"node\" ist nicht installiert.$NORMAL Die Installation wird gestartet..."
    sleep 2
    clear
    echo -e "$PURPLEℹ Wird heruntergeladen..."
    curl -sSL https://deb.nodesource.com/setup_16.x | bash
    clear
    echo -e "$PURPLEℹ Wird installiert..."
    apt-get install nodejs -y
fi

clear

if [ "$1" == "--beta" ]; then
  RELEASE_URL=https://github.com/gnmyt/myspeed/archive/refs/heads/development.zip
else
  RELEASE_URL=$(curl -s https://api.github.com/repos/gnmyt/myspeed/releases/latest | grep browser_download_url | cut -d '"' -f 4)
fi


echo -e "$GREEN✓ Vorbereitung abgeschlossen:$NORMAL Die Installation von MySpeed wird jetzt gestartet..."
sleep 3

clear
if [ ! -d "$INSTALLATION_PATH" ]
then
    clear
    echo -e "$BLUEℹ Info: $NORMAL MySpeed wird unter dem Verzeichnis $INSTALLATION_PATH installiert. Der Ordner wird nun erstellt."
    sleep 2
    mkdir "$INSTALLATION_PATH"
fi

cd "$INSTALLATION_PATH"

clear
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


clear
echo -e "$BLUEℹ Info: $NORMAL Die notwendigen Abhängigkeiten werden jetzt installiert..."
sleep 2
rm -rf "$INSTALLATION_PATH/node_modules"
npm install --force

if [ "$1" == "--beta" ]; then
  clear
  echo -e "$BLUEℹ Info: $NORMAL Die Weboberfläche wird kompiliert..."
  sleep 2
  cd client && npm install --force
  cd .. && npm run build
  cp -r client/build .
  rm -rf client/build
fi

# Install as system service
clear
echo -e "$BLUE🔎 STATUSMELDUNG"
echo -e "$NORMAL Registriere MySpeed als Hintergrunddienst..."
echo -e ""
echo -e ""
sleep 2
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
  WorkingDirectory=$INSTALLATION_PATH

  [Install]
  WantedBy=multi-user.target
EOF
  systemctl daemon-reload
  echo -e "$NORMALℹ MySpeed wird im Autostart hinzugefügt..."
  sleep 1
  systemctl enable myspeed
  echo -e "$NORMALℹ MySpeed Dienst wird gestartet..."
  sleep 1
  systemctl start myspeed
fi

clear

if ! command -v systemctl &> /dev/null; then
    echo -e "$YELLOW⚠ Warnung: $NORMAL Dein Linux-System bietet derzeit nicht die Möglichkeit, MySpeed im Hintergrund zu starten. Hierfür wird \"systemd\" benötigt."
    echo -e "$BLUEℹ Info: $NORMAL Du kannst, wenn du \"systemd\" installiert hast, die Installation erneut starten. Es wird dann automatisch eingestellt."
    sleep 5
else
  echo -e "$GREENℹ MySpeed wird neu gestartet..."
  sleep 2
  systemctl restart myspeed
fi

clear
echo -e "$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-" #multicolor
echo -e "$GREEN✓ Installation abgeschlossen: $NORMAL MySpeed wurde unter $INSTALLATION_PATH installiert."
echo -e "Die Weboberfläche findest du im Browser unter$BLUE http://$(curl -s ifconfig.me):5216$NORMAL."
if [ -d "$INSTALLATION_PATH" ]; then
  echo -e "$BLUEℹ Info:$NORMAL Sollte das Update nicht erfolgreich angewendet worden sein, bitte starte MySpeed mal neu:$BLUE systemctl restart myspeed"
fi
echo -e "$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-" #multicolor
# MySpeed is installed successfully.
