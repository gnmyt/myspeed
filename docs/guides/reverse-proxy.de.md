# Konfiguration eines Reverse Proxies

In diesem Guide wird erklärt, wie du mithilfe von `apache` oder `nginx` einen Reverse Proxy mit MySpeed einrichtest.

!!! tip "Warum einen Reverse Proxy verwenden?"
    In diesem Fall verwenden wir einen Reverse Proxy als Zwischenschicht zwischen dir und MySpeed.
    Dies hat den Vorteil, dass du MySpeed nicht über einen Port aufrufen musst, sondern über eine normale Domain.

## Installation
Solltest du bereits einen Reverse Proxy installiert haben, kannst du diesen Schritt überspringen. Welchen der beiden
Reverse Proxies du verwenden möchtest, ist dir überlassen. Wir empfehlen dir jedoch für diesen Guide `nginx`.

=== "nginx"
    ```sh
    sudo apt-get install nginx -y
    ```

=== "apache"
    ```sh
    sudo apt-get install apache2 -y
    ```

## Konfiguration von MySpeed

In diesem Abschnitt wird erklärt, wie du MySpeed mit deinem Reverse Proxy verbindest. Wähle hier auch wieder aus, 
welchen Reverse Proxy du verwendet hast.

=== "nginx"
    Erstelle nun eine Datei mit dem Namen `myspeed.conf` unter `/etc/nginx/sites-available`. Hier verwenden wir `nano`
    ```sh
    sudo nano /etc/nginx/sites-available/myspeed.conf
    ```
    Füge nun folgenden Inhalt in die Datei ein:
    ```nginx
    server {
        listen 80;
        listen [::]:80;

        server_name deine-domain.de;

        location / {
            proxy_pass http://localhost:5216;
        }
    }
    ```
    Nun musst du nur noch die Datei aktivieren und den Reverse Proxy neustarten.
    ```sh
    sudo ln -s /etc/nginx/sites-available/myspeed.conf /etc/nginx/sites-enabled/myspeed.conf
    sudo systemctl restart nginx
    ```

=== "apache"
    Erstelle nun eine Datei mit dem Namen `myspeed.conf` unter `/etc/apache2/sites-available`. Hier verwenden wir `nano`
    ```sh
    sudo nano /etc/apache2/sites-available/myspeed.conf
    ```
    Füge nun folgenden Inhalt in die Datei ein:
    ```apache
    <VirtualHost *:80>
        ServerName deine-domain.de

        ProxyPreserveHost On
        ProxyPass / http://localhost:5216/
        ProxyPassReverse / http://localhost:5216/
    </VirtualHost>
    ```
    Aktiviere nun die `mod_proxy` und `mod_proxy_http` Module.
    ```sh
    sudo a2enmod proxy
    sudo a2enmod proxy_http
    ```
    Nun musst du nur noch die Datei aktivieren und den Reverse Proxy neustarten.
    ```sh
    sudo a2ensite myspeed.conf
    sudo systemctl restart apache2
    ```

## Konfiguration eines SSL Zertifikats mit Let's Encrypt

In diesem Abschnitt wird erklärt, wie du ein SSL Zertifikat von Let's Encrypt für MySpeed einrichtest.

!!! tip "Verwendest du Cloudflare?"
    Wenn du Cloudflare verwendest und nicht extra ein SSL Zertifikat von Let's Encrypt einrichten möchtest, kannst du
    auch einfach die Cloudflare Proxy Funktion aktivieren. Das genügt in den meisten Fällen vollkommen. Wenn du
    dich für den Cloudflare Proxy entscheidest, kannst du diesen Abschnitt überspringen.

=== "nginx"
    Zuerst musst du Certbot installieren. Hierfür verwenden wir `apt`.
    ```sh
    sudo apt-get install certbot python3-certbot-nginx -y
    ```
    Nun musst du Certbot ausführen und die Domain angeben, für die du das Zertifikat einrichten möchtest.
    ```sh
    sudo certbot --nginx -d deine-domain.de
    ```

=== "apache"
    Zuerst musst du Certbot installieren. Hierfür verwenden wir `apt`.
    ```sh
    sudo apt-get install certbot python3-certbot-apache -y
    ```
    Nun musst du Certbot ausführen und die Domain angeben, für die du das Zertifikat einrichten möchtest.
    ```sh
    sudo certbot --apache -d deine-domain.de
    ```