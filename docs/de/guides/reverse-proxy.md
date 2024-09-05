# Konfiguration eines Reverse Proxies

::: Tipp Warum einen Reverse Proxy verwenden?
In diesem Fall verwenden wir einen Reverse Proxy als Zwischenschicht zwischen dir und MySpeed.
Der Vorteil dabei ist, dass du MySpeed nicht über einen Port aufrufen musst, sondern über eine normale Domain.
:::

## Installation

Falls du bereits einen Reverse Proxy installiert hast, kannst du diesen Schritt überspringen. Welchen der beiden Reverse Proxies du verwenden möchtest,
liegt bei dir. Wir empfehlen jedoch `nginx` für diese Anleitung.

::: code-group

```sh [nginx]
sudo apt-get install nginx -y
```

```sh [apache]
sudo apt-get install apache2 -y
```

:::

## Konfiguration von MySpeed

In diesem Abschnitt wird erklärt, wie du MySpeed mit deinem Reverse Proxy verbinden kannst. Wähle hier erneut aus, welchen Reverse Proxy du verwendet hast.

::: code-group

```sh [nginx]
# Erstelle eine Datei namens myspeed.conf unter /etc/nginx/sites-available. Hier verwenden wir nano
sudo nano /etc/nginx/sites-available/myspeed.conf
```

```nginx [myspeed.conf]
server {
    listen 80;
    listen [::]:80;

    server_name deine-domain.de;

    location / {
        proxy_pass http://localhost:5216;
    }
}
```

```sh [nginx]
# Aktiviere die Datei und starte den Reverse Proxy neu
sudo ln -s /etc/nginx/sites-available/myspeed.conf /etc/nginx/sites-enabled/myspeed.conf
sudo systemctl restart nginx
```

```sh [apache]
# Erstelle eine Datei namens myspeed.conf unter /etc/apache2/sites-available. Hier verwenden wir nano
sudo nano /etc/apache2/sites-available/myspeed.conf
```

```apache [myspeed.conf]
<VirtualHost *:80>
    ServerName deine-domain.de

    ProxyPreserveHost On
    ProxyPass / http://localhost:5216/
    ProxyPassReverse / http://localhost:5216/
</VirtualHost>
```

```sh [apache]
# Aktiviere die Module mod_proxy und mod_proxy_http
sudo a2enmod proxy
sudo a2enmod proxy_http

# Aktiviere die Datei und starte den Reverse Proxy neu
sudo a2ensite myspeed.conf
sudo systemctl restart apache2
```

:::

## Konfiguration eines SSL-Zertifikats mit Let's Encrypt

In diesem Abschnitt wird erklärt, wie du ein SSL-Zertifikat von Let's Encrypt für MySpeed einrichtest.

::: Tipp Verwendest du Cloudflare?
Wenn du Cloudflare nutzt und kein SSL-Zertifikat von Let's Encrypt einrichten möchtest, kannst du einfach die Cloudflare Proxy-Funktion aktivieren. Das ist in den meisten Fällen ausreichend. Wenn du dich dafür entscheidest, die Cloudflare-Proxy zu verwenden, kannst du diesen Abschnitt überspringen.
:::

::: code-group

```sh [nginx]
# Installiere Certbot
sudo apt-get install certbot python3-certbot-nginx -y

# Führe Certbot aus und gib die Domain an
sudo certbot --nginx -d deine-domain.de
```

```sh [apache]
# Installiere Certbot
sudo apt-get install certbot python3-certbot-apache -y

# Führe Certbot aus und gib die Domain an
sudo certbot --apache -d deine-domain.de
```