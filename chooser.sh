#!/usr/bin/env bash

GREEN='\033[0;32m'
BLUE='\033[1;34m'
YELLOW='\033[1;33m'
RED='\033[1;31m'
NORMAL='\033[0;39m'
PURPLE='\033[0;35m'

if [ $EUID -ne 0 ]; then
  echo -e "$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-"
  echo -e "$RED✗ ABORTED"
  echo -e "$NORMAL The installation is currently running via a user without root privileges. However, this is required. Please log in with a Root Account to continue."
  echo -e "$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-"
  exit
fi

echo -e "${GREEN}---------${BLUE} MySpeed Installation ${GREEN}---------${NORMAL}"
echo -e "${BLUE}Welcome to MySpeed Installation Script!${NORMAL}"
echo -e "${YELLOW}Do you want to install MySpeed with Docker or the normal installation script?${NORMAL}"
echo -e "${YELLOW}[1]${NORMAL} Docker"
echo -e "${YELLOW}[2]${NORMAL} Normal Install Script"

read -p "Enter your choice (1/2): " choice

case $choice in
    1)
        echo -e "${BLUE}Running Docker installation script...${NORMAL}"
        bash <(curl -sSL https://raw.githubusercontent.com/gnmyt/myspeed/development/docker-install.sh)
        ;;
    2)
        echo -e "${BLUE}Running normal installation script...${NORMAL}"
        bash <(curl -sSL https://raw.githubusercontent.com/gnmyt/myspeed/development/install.sh)
        ;;
    *)
        echo -e "${RED}Invalid choice. Exiting.${NORMAL}"
        exit 1
        ;;
esac