#!/usr/bin/env bash


GREEN='\033[0;32m'
BLUE='\033[1;34m'
YELLOW='\033[1;33m'
RED='\033[1;31m'
NORMAL='\033[0;39m'

INSTALLATION_PATH="/opt/myspeed"
DOCKER_INSTALLATION_PATH="/opt/myspeed-dockerized"

if [ $EUID -ne 0 ]; then
  echo -e "$RED✗ Uninstallation Error:$NORMAL You need root privileges to initiate the uninstallation."
  exit
fi

echo -e "$GREEN ---------$BLUE Automatic Uninstallation$GREEN ---------"
echo -e "$BLUE MySpeed$YELLOW is now being uninstalled."
echo -e "$YELLOW If you want to$RED cancel$YELLOW, you can abort the uninstallation by pressing$RED CTRL + C$YELLOW."
echo -e "$GREEN Uninstallation will begin in 5 seconds..."
echo -e "$GREEN ----------------------------------------------"
sleep 5

clear
echo -e "$BLUE🔎 Status:$NORMAL Removing service data if present..."
sleep 3

if docker ps -a --format '{{.Names}}' | grep -q "MySpeed"; then
  echo -e "$YELLOW Found Docker container. Stopping the container..."
  docker stop MySpeed
  echo -e "$YELLOW Removing Docker container..."
  docker rm MySpeed
  echo -e "$YELLOW Removing MySpeed Docker folder..."
  if [ "$1" != "--keep-data" ]; then
    docker volume rm myspeed-dockerized_myspeed
  fi
  rm -rf $DOCKER_INSTALLATION_PATH
else
  if command -v systemctl &> /dev/null && systemctl --all --type service | grep -n "myspeed.service"; then
    systemctl stop myspeed
    systemctl disable myspeed
    rm /etc/systemd/system/myspeed.service
    rm /usr/lib/systemd/system/myspeed.service
    systemctl daemon-reload
    systemctl reset-failed
  fi

  clear
  echo -e "$BLUE🔎 Status:$NORMAL Removing MySpeed system data if present..."
  sleep 3

  # Remove folder
  if [ "$1" == "--keep-data" ]; then
    mv $INSTALLATION_PATH/data /tmp/myspeed_data
    rm -R $INSTALLATION_PATH
    mkdir $INSTALLATION_PATH
    mv /tmp/myspeed_data $INSTALLATION_PATH/data
  else
    rm -R $INSTALLATION_PATH
  fi
fi

clear
echo -e "$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-" #multicolor
echo -e "$GREEN✓ Completed: $NORMAL MySpeed has been uninstalled."
echo -e "$NORMAL You can reinstall MySpeed anytime. Find the instructions at https://myspeed.dev/install."
echo -e "$RED Thank you for using MySpeed!"
echo -e "$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-" #multicolor
