#!/usr/bin/env bash

set -e

echo "Parsing: $1"

cd "/Users/finnlesueur/Git/blog/"
git pull origin master

filename=$(exiftool -s -S -filename "$1")

# Date
dateStr=$(exiftool -time:FileCreateDate -s -S "$1")
photoDate=$(date -jf "%Y:%m:%d %T" "$dateStr")
formattedDate=$(gdate --date="$photoDate" +"%Y-%m-%dT%T%:z")
ymd=$(gdate --date="$photoDate" +"%Y-%m-%d")
echo "Taken: $formattedDate"

# Photographer
read -p 'Photographer: [Finn Le Sueur]' photographer
photographer=${photographer:-"Finn Le Sueur"}
echo "Photographer: $photographer"

read -p "Title: " title
read -p "Description: " description
echo ""

file="+++
title = '$title'
date = $formattedDate
photoDate = $formattedDate
image = '$filename'
photographer = '$photographer'
+++

$description
"

folderPath="/Users/finnlesueur/Git/blog/content/photos/$ymd"
echo "Folder $folderPath";

if [ -d "$folderPath" ] 
then
    echo "Folder doesn't exist";
    mkdir -p "$folderPath"
    if [ $? -eq 0 ]; then
        echo OK
    else
        echo FAIL
    fi
else
    echo "Folder does exist, making a second one."
    folderPath="$folderPath-1"
    echo "$folderPath"
    mkdir -p "$folderPath"
    if [ $? -eq 0 ]; then
        echo OK
    else
        echo FAIL
    fi
fi


cp $1 "$folderPath/"
echo "$file" >> "$folderPath/index.md";

git add .
git commit -m "Post photo '$title' to blog."
git push origin master
