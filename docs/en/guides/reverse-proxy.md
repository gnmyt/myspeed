# Setting up a Reverse Proxy with MySpeed

::: tip Why use a reverse proxy?
In this case we use a reverse proxy as an intermediate layer between you and MySpeed.
This has the advantage that you don't have to call MySpeed via a port, but via a normal domain.
:::

## Installation

If you already have a reverse proxy installed, you can skip this step. Which of the two reverse proxies you want to use
is up to you. However, we recommend `nginx` for this guide.

::: code-group

```sh [nginx]
sudo apt-get install nginx -y
```

```sh [apache]
sudo apt-get install apache2 -y
```

:::

## Configuring MySpeed

This section explains how to connect MySpeed to your reverse proxy. Again, select here which reverse proxy you used.

::: code-group

```sh [nginx]
# Create a file named myspeed.conf under /etc/nginx/sites-available. Here we use nano
sudo nano /etc/nginx/sites-available/myspeed.conf
```

```nginx [myspeed.conf]
server {
    listen 80;
    listen [::]:80;

    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5216;
    }
}
```

```sh [nginx]
# Activate the file and restart the reverse proxy
sudo ln -s /etc/nginx/sites-available/myspeed.conf /etc/nginx/sites-enabled/myspeed.conf
sudo systemctl restart nginx
```

```sh [apache]
# Create a file named myspeed.conf under /etc/apache2/sites-available. Here we use nano
sudo nano /etc/apache2/sites-available/myspeed.conf
```

```apache [myspeed.conf]
<VirtualHost *:80>
    ServerName your-domain.com

    ProxyPreserveHost On
    ProxyPass / http://localhost:5216/
    ProxyPassReverse / http://localhost:5216/
</VirtualHost>
```

```sh [apache]
# Enable the mod_proxy and mod_proxy_http modules
sudo a2enmod proxy
sudo a2enmod proxy_http

# Activate the file and restart the reverse proxy
sudo a2ensite myspeed.conf
sudo systemctl restart apache2
```

:::

## Configuring an SSL certificate with Let's Encrypt

This section explains how to set up an SSL certificate from Let's Encrypt for MySpeed.

::: tip Are you using Cloudflare?
If you use Cloudflare and don't want to set up an SSL certificate from Let's Encrypt, you can just use the simply
activate the Cloudflare proxy function. This is sufficient in most cases. If you decide to use the Cloudflare proxy, you
can skip this section.
:::

::: code-group

```sh [nginx]
# Install certbot
sudo apt-get install certbot python3-certbot-nginx -y

# Run Certbot and specify the domain
sudo certbot --nginx -d your-domain.com
```

```sh [apache]
# Install certbot
sudo apt-get install certbot python3-certbot-apache -y

# Run Certbot and specify the domain
sudo certbot --apache -d your-domain.com
```