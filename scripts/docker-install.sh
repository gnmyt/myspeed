#!/usr/bin/env bash

GREEN='\033[0;32m'
BLUE='\033[1;34m'
YELLOW='\033[1;33m'
RED='\033[1;31m'
NORMAL='\033[0;39m'

if [ $EUID -ne 0 ]; then
  echo -e "$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-"
  echo -e "$RED✗ ABORTED"
  echo -e "$NORMAL The installation is currently running via a user without root privileges. However, this is required. Please log in with a Root Account to continue."
  echo -e "$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-"
  exit
fi

if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Docker is not installed. Installing Docker...${NORMAL}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi

INSTALLATION_PATH="/opt/myspeed-dockerized"
mkdir -p "$INSTALLATION_PATH"

echo -e "${BLUE}Creating docker-compose.yml file...${NORMAL}"
cat << EOF > "$INSTALLATION_PATH/docker-compose.yml"
version: '3'
services:
  myspeed:
    image: germannewsmaker/myspeed
    ports:
      - "5216:5216"
    volumes:
      - myspeed:/myspeed/data
    restart: unless-stopped
    container_name: MySpeed
volumes:
  myspeed:
EOF

echo -e "${GREEN}Starting MySpeed Docker container...${NORMAL}"
cd "$INSTALLATION_PATH" && docker compose up -d

if [ $? -eq 0 ]; then
    echo -e "${GREEN}MySpeed Docker container started successfully.${NORMAL}"
else
    echo -e "${RED}Error: Failed to start MySpeed Docker container.${NORMAL}"
    exit 1
fi