# Setup Linux
Here the setup for Linux is described. MySpeed can be installed in several ways.

## Installation with Docker

::: tip Help
   You don't know how to install Docker? Then check out [this guide](https://docs.docker.com/engine/install/#server)
:::


::: code-group

```sh [Stable Version]
docker run -d -p 5216:5216 -v myspeed:/myspeed/data --restart=unless-stopped --name MySpeed germannewsmaker/myspeed
```


```sh [Development Version]
docker run -d -p 5216:5216 -v myspeed:/myspeed/data --restart=unless-stopped --name MySpeed germannewsmaker/myspeed:development
```

:::

## Automatic installation

::: code-group

```sh [Stable Version]
bash <(curl -sSL https://install.myspeed.dev)
```

```sh [Development Version]
curl -sSL https://raw.githubusercontent.com/gnmyt/myspeed/development/scripts/install.sh | bash -s -- --beta
```

:::

## Automatic uninstall process
Don't want to use MySpeed anymore? You can easily remove MySpeed. Decide here if you want to keep or delete your data.

::: warning Execute these commands with caution
Executing the commands will result in deletion / uninstallation of MySpeed. Please be aware of this.
:::

::: code-group

```sh [Keep data]
curl -sSL https://raw.githubusercontent.com/gnmyt/myspeed/development/scripts/uninstall.sh | bash -s -- --keep-data
```

```sh [Delete data]
curl -sSL https://raw.githubusercontent.com/gnmyt/myspeed/development/scripts/uninstall.sh | bash
```

:::

## Manual installation
```sh
sudo apt-get install wget curl unzip -y #(1)

# You only need to do this if you don't have NodeJS installed yet
curl -sSL https://deb.nodesource.com/setup_18.x | bash
sudo apt-get install nodejs -y #(2)

mkdir /opt/myspeed && cd /opt/myspeed #(3)

wget $(curl -s https://api.github.com/repos/gnmyt/myspeed/releases/latest | grep browser_download_url | cut -d '"' -f 4) #(4)

unzip MySpeed-*.zip && rm MySpeed-*.zip #(5)

npm install #(6)

NODE_ENV=production node server #(7)
```

1. Here you install all necessary packages to install the project.
2. This step installs the latest version of NodeJS.
3. Now create the folder where you want to install MySpeed. In this case it is the folder `/opt/myspeed`.
4. Now install the newest version of MySpeed.
5. Now unzip the file you just downloaded (then you can delete it)
6. Now install all dependencies.
7. Now MySpeed is started. MySpeed is now available on port 5216.
   If you plan to run MySpeed in the background, see the guide below.

## Install MySpeed from the source code
::: warning Attention
This process installs the latest development version of MySpeed. Errors may occur.

:::

```sh
sudo apt-get install git curl -y #(1)

# You only need to run this if you don't have NodeJS installed yet
curl -sSL https://deb.nodesource.com/setup_18.x | bash
sudo apt-get install nodejs -y #(2)

mkdir /opt/myspeed && cd /opt/myspeed #(3)

git clone https://github.com/gnmyt/myspeed.git . #(4)

npm install #(5)

cd client && npm install && npm run build && cd .. && mv client/build . #(6)

NODE_ENV=production node server #(7)
```

1. here you install all necessary packages to install the project.
2. this step installs the latest version of NodeJS.
3. now create the folder where you want to install MySpeed. In this case this is the folder `/opt/myspeed`.
4. clone the MySpeed repository to get access to the code.
5. now install all dependencies of the server.
6. now compile the interface of MySpeed and move it to the folder where MySpeed can read it.
7. now start MySpeed. MySpeed is now accessible on port 5216.
   If you plan to run MySpeed in the background, see the guide below.


## Install MySpeed 24/7
::: warning Important
You have used the installation script? Then you don't need to do this step at all.
:::

Installing as a system service is not even that hard. In this case we use `systemd`, because it is directly integrated in most Linux distributions.

1. Create a file named `myspeed.service` under `/etc/systemd/system`. Here we use `nano`
   ```sh
   nano /etc/systemd/system/myspeed.service
   ```

2. Now paste the content of the file.
   ```ini
   [Unit]
   Description=MySpeed
   After=network.target

   [Service]
   Type=simple
   ExecStart=/usr/bin/node server
   Restart=always
   # \/ It is strongly recommended to create your own user here
   User=root
   Environment=NODE_ENV=production
   # \/ Specify your installation location here
   WorkingDirectory=/opt/myspeed 

   [Install]
   WantedBy=multi-user.target
   ```

3. Save the file. This varies a bit depending on the editor

   ::: code-group
   ```sh [nano]
    Press `CTRL` + `X`, then press `Y` and press `Enter` to save the file and exit the editor.
    ```
    
    ```sh [vim]
    Press `ESC`, then type `:wq` and press `Enter` to save the file and exit the editor.
    ```

4. Now reload systemd
   ```sh
   systemctl daemon-reload
   ```

5. If you want MySpeed to boot at systemd startup, type this command:
   ```sh
   systemctl enable myspeed
   ```

6. Done! Now you can finally start MySpeed.
   ```sh
   systemctl start myspeed
   ```

7. Now check the status of MySpeed
   ```sh
   systemctl status myspeed
   ```