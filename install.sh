#!/usr/bin/env bash

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

if [ $EUID -ne 0 ]; then
  echo -e "$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-"
  echo -e "$RED✗ ABORTED"
  echo -e "$NORMAL The installation is currently running via a user without root privileges. However, this is required. Please log in with a Root Account to continue."
  echo -e "$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-"
  exit
fi

echo -e "$GREEN ---------$BLUE Automatic Installation$GREEN ---------"
echo -e "$BLUE MySpeed$YELLOW is now being installed."
if [ "$1" == "--beta" ]; then
  echo -e "$YELLOW Version:$BLUE MySpeed$PURPLE Beta"
else
  echo -e "$YELLOW Version:$BLUE MySpeed Release"
fi
echo -e "$YELLOW Location:$BLUE $INSTALLATION_PATH"
echo -e "$GREEN Installation will start in 5 seconds..."
echo -e "$GREEN ----------------------------------------------"
sleep 10
clear

if [ -d "$INSTALLATION_PATH" ]; then
    clear
    echo -e "$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-"
    echo -e ""
    echo -e "$YELLOW⚠ WARNING"
    echo -e "$NORMAL MySpeed is already installed on this system."
    echo -e ""
    echo -e "$GREENℹ Info:$NORMAL Latest update will be installed..."
    echo -e ""
    echo -e "$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-"
    sleep 5
fi

if command -v systemctl &> /dev/null && systemctl --all --type service | grep -n "myspeed.service"; then
  clear
  echo -e "$YELLOWℹ MySpeed Service is being stopped..."
  systemctl stop myspeed
fi


clear
echo -e ""
echo -e "$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-"
echo -e ""
echo -e "$BLUE🔎 STATUS MESSAGE"
echo -e "$NORMAL Searching for updates for Linux system..."
echo -e ""
echo -e "$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-"
echo -e ""
apt-get update -y

clear
echo -e "$GREENℹ Info:$NORMAL Installation is now being prepared. This may take a moment..."
sleep 5

function check() {
  clear
  echo -e "$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-"
  echo -e "$BLUE🔎 STATUS MESSAGE"
  echo -e "$NORMAL Checking if $1 is present..."
  echo -e "$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-"
  echo -e ""
  if ! command -v "$1" &> /dev/null
  then
      echo -e "$YELLOWℹ \"$1\" is not installed.$NORMAL Installation will proceed..."
      sleep 2
      echo -e "$PURPLEℹ Installing..."
      apt-get install "$1" -y
  fi
}

check "wget"
check "unzip"
check "curl"

clear
echo -e "$BLUE🔎 STATUS MESSAGE"
echo -e "$NORMAL Checking if node is present..."
if ! command -v node &> /dev/null
then
    echo -e "$YELLOWℹ \"node\" is not installed.$NORMAL Installation will proceed..."
    sleep 2
    clear
    echo -e "$PURPLEℹ Downloading...$NORMAL"
    curl -sSL https://deb.nodesource.com/setup_20.x | bash
    clear
    echo -e "$PURPLEℹ Installing...$NORMAL"
    apt-get install nodejs -y
fi

clear

if [ "$1" == "--beta" ]; then
  RELEASE_URL=https://github.com/gnmyt/myspeed/archive/refs/heads/development.zip
else
  RELEASE_URL=$(curl -s https://api.github.com/repos/gnmyt/myspeed/releases/latest | grep browser_download_url | cut -d '"' -f 4)
fi


echo -e "$GREEN✓ Preparation completed:$NORMAL Installation of MySpeed will now commence..."
sleep 3

clear
if [ ! -d "$INSTALLATION_PATH" ]
then
    clear
    echo -e "$BLUEℹ Info: $NORMAL MySpeed will be installed under directory $INSTALLATION_PATH. Creating the folder now."
    sleep 2
    mkdir "$INSTALLATION_PATH"
fi

cd "$INSTALLATION_PATH"

clear
echo -e "$BLUEℹ Info: $NORMAL The current MySpeed instance is being downloaded. Please wait..."
sleep 2
wget "$RELEASE_URL"

echo -e "$BLUEℹ Info: $NORMAL Download completed. Unpacking..."
sleep 2
if [ "$1" == "--beta" ]; then
  unzip -qo development.zip
  rm -R server client docs cli
  mv myspeed-*/* .
  rm development.zip
  rm -R myspeed-development
else
  unzip -qo MySpeed*.zip
  rm MySpeed-*.zip
fi


clear
echo -e "$BLUEℹ Info: $NORMAL Necessary dependencies are being installed..."
sleep 2
rm -rf "$INSTALLATION_PATH/node_modules"
npm install --force

if [ "$1" == "--beta" ]; then
  clear
  echo -e "$BLUEℹ Info: $NORMAL Web interface is being compiled..."
  sleep 2
  cd client && npm install --

force
  cd .. && npm run build
  cp -r client/build .
  rm -rf client/build
fi

clear
echo -e "$BLUE🔎 STATUS MESSAGE"
echo -e "$NORMAL Registering MySpeed as a background service..."
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
  echo -e "$NORMALℹ MySpeed will be added to autostart..."
  sleep 1
  systemctl enable myspeed
  echo -e "$NORMALℹ MySpeed service is starting..."
  sleep 1
  systemctl start myspeed
fi

clear

if ! command -v systemctl &> /dev/null; then
    echo -e "$YELLOW⚠ Warning: $NORMAL Your Linux system currently does not support starting MySpeed in the background. \"systemd\" is required for this purpose."
    echo -e "$BLUEℹ Info: $NORMAL If you have installed \"systemd\", you can restart the installation. It will be set up automatically."
    sleep 5
else
  echo -e "$GREENℹ MySpeed is being restarted..."
  sleep 2
  systemctl restart myspeed
fi

clear
echo -e "$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-"
echo -e "$GREEN✓ Installation completed: $NORMAL MySpeed has been installed under $INSTALLATION_PATH."
echo -e "You can access the web interface in your browser at$BLUE http://$(curl -s ifconfig.me):5216$NORMAL."
if [ -d "$INSTALLATION_PATH" ]; then
  echo -e "$BLUEℹ Info:$NORMAL If the update was not successful, please restart MySpeed:$BLUE systemctl restart myspeed"
fi
echo -e "$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-"
