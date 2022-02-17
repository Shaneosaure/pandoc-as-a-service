# Pandoc As A Service
If you need to convert a markdown file to a beautiful PDF (initial view at 100%, metadata according to YAML markdown ...)

## Overview

This git is a modified version of https://github.com/mrded/pandoc-as-a-service . Its only goal is to export PDF from markdown.
![image](https://user-images.githubusercontent.com/25083427/154469008-fafc2062-3bbd-4773-9f3d-4df80b82f46f.png)

## Installation
```bash
git clone https://github.com/Shaneosaure/pandoc-as-a-service.git
``` 

### apt packages
Pandoc will be required to convert the markdown as well as wkhmltopdf. Ghostscript and Exiftool are needed to edit metadatas.
```bash
sudo apt install pandoc wkhtmltopdf ghostscript exiftool
```

### node packages
You need to install nodeJS v16.xx (https://github.com/nodesource/distributions/blob/master/README.md#debinstall) and yarn (https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable).

```bash
npm -g install mermaid-filter
```

Install the depedencies of the project:
```bash
cd pandoc-as-a-service/
yarn install
```

### setup
We need to make the conversion script executable:
```bash
chmod +x convert.sh
```
Create a folder for the files:
```bash
mkdir Files
```
### Configuration of mermaid filter (optional)
We need to edit the mermaid node module to export the graphs as SVG for a better scalability. 
```bash
sudo nano /usr/lib/node_modules/mermaid-filter/index.js
```
And edit the line 30 and replace `'png'` by `'svg'`:
```
    format: process.env.MERMAID_FILTER_FORMAT || 'svg',
```

### Apache2 configuration (optional)
To handle the website with a custom server name and so on, we recommend to use apache2 with the following configuration:

#### Install apache2 + modules
```bash
sudo apt-get install apache2
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod proxy_balancer
sudo systemctl restart apache2
```
#### Example of a configuration
Configuration file (`/etc/apache2/sites-available/<file>.conf`):
```conf
<VirtualHost *:80>
        ServerName localhost

        ServerAdmin webmaster@localhost
        DocumentRoot /var/www/html

        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined

        ProxyPreserveHost On
        ProxyVia Full
        ProxyRequests Off

        ServerAlias localhost
        
        ProxyPass "/convert" "http://localhost:4000"
        ProxyPassReverse "/convert" "http://localhost:4000"
</VirtualHost>
```

## Start the project
You can customize the port you want to use. Run the port as an argument:
```bash
node index.js 4000
```

