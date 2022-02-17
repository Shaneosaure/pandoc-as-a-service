#!/bin/bash

rm Files/*.pdf
rm Files/.pdf
MDFILE=$1
HTMLFILE="${1%.*}.html"
PDFFILE="${1%.*}.pdf"
echo "Convertion of $1 into an html : $HTMLFILE"
pandoc "$1" -s -F mermaid-filter -t html --template=easy_template -o "$HTMLFILE" 

echo -e "\nConvertion of $HTMLFILE into a pdf : $PDFFILE\n"
wkhtmltopdf "$HTMLFILE" "$PDFFILE"

echo "Let's work on the metadata"
metadata="$(sed -n '/---/,/---/{s/^---.*//;p;}' "$1")"

metadata=${metadata#*title: \"}
title=${metadata/\"*/}

metadata=${metadata#*author: \"}
author=${metadata/\"*/}

metadata=${metadata#*subject: \"}
subject=${metadata/\"*/}

echo "Title: $title"
echo "Subject: $subject"
echo "Author: $author"

echo -e "\nAdjusting metadata..."
exiftool -Title="$title" -Author="$author" -Creator="$author" -Description="$subject"  -Subject="$subject"  "$PDFFILE"

PDFFILEFINAL="${title}.pdf"

echo -e "\nAdjusting inital view"
gs                                                              \
  -o "$PDFFILEFINAL"                                                    \
  -sDEVICE=pdfwrite                                             \
  -c "[ /PageMode /UseNone /Page 1 /View [ /XYZ null null 1 ] " \
  -c "  /PageLayout /SinglePage /DOCVIEW pdfmark"               \
  -f "$PDFFILE"

mv "$PDFFILEFINAL" Files/
rm "$PDFFILE"

PDFFILE="${PDFFILE%.*}.pdf_original"

rm "$PDFFILE"
rm "$HTMLFILE"
rm "$MDFILE"
exit 0
