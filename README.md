# Pandoc As A Service
If you need to convert a markdown file to a beautiful PDF (initial view at 100%, metadata according to YAML markdown ...)

## Overview

This git is a modified version of https://github.com/mrded/pandoc-as-a-service . Its only goal is to export PDF from markdown.

## Installation
```bash
git clone https://github.com/Shaneosaure/pandoc-as-a-service.git
``` 

### apt packages
Pandoc will be required to convert the markdown as well as wkhmltopdf. Ghostscript and Exiftool are needed to edit metadatas.
```bash
apt install pandoc wkhtmltopdf ghostscript exiftool
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
We need to make the conversion script executable:
```bash
chmod +x convert.sh
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

