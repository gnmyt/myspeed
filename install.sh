#!/usr/bin/env bash

INSTALLATION_PATH="/opt/myspeed"
RELEASE_URL=$(curl -s https://api.github.com/repos/gnmyt/myspeed/releases/latest | grep browser_download_url | cut -d '"' -f 4)

log () {
    printf "\033[0;34m$1\e[0m\n"
}

# Root check
if [ $EUID -ne 0 ]; then
  echo "Du musst dieses Skript als root ausführen"
  exit
fi

# Check if installed
if [ -d $INSTALLATION_PATH ]; then
    log "Eine MySpeed-Instanz unter $INSTALLATION_PATH wurde bereits installiert. Die Installation wird abgebrochen."
    exit 0
fi


# Update all packages
apt-get update -y

# Check for wget
if ! command -v wget &> /dev/null
then
    log "Das Paket \"wget\" wurde nicht gefunden, wird aber benötigt. Es wird nun installiert..."
    sleep 2
    apt-get install wget -y
fi

# Check for unzip
if ! command -v unzip &> /dev/null
then
    log "Das Paket \"unzip\" wurde nicht gefunden, wird aber benötigt. Es wird nun installiert..."
    sleep 2
    apt-get install unzip -y
fi

# Check for curl
if ! command -v curl &> /dev/null
then
    log "Das Paket \"curl\" wurde nicht gefunden, wird aber benötigt. Es wird nun installiert..."
    sleep 2
    apt-get install curl -y
fi

# Check for node
if ! command -v node &> /dev/null
then
    log "Das Paket \"nodejs\" wurde nicht gefunden, wird aber benötigt. Es wird nun installiert..."
    sleep 2
    curl -sSL https://deb.nodesource.com/setup_16.x | bash
    apt-get install nodejs -y
fi

log "Alle notwendigen Pakete sind installiert. Starte installation von MySpeed..."
sleep 2

if [ ! -d $INSTALLATION_PATH ]
then
    log "MySpeed wird unter $INSTALLATION_PATH installiert. Der Ordner wird nun erstellt."
    sleep 2
    mkdir $INSTALLATION_PATH
fi

cd $INSTALLATION_PATH

log "Lade notwendige Daten herunter..."
sleep 2
wget "$RELEASE_URL"

log "Entpacke notwendige Daten..."
sleep 2
unzip MySpeed*.zip
rm MySpeed-*.zip

log "Lade die notwendigen Abhängigkeiten herunter..."
sleep 2
npm install

clear
log "Erfolg! MySpeed wurde unter $INSTALLATION_PATH installiert."