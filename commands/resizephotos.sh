#!/bin/bash

# Get the directory of the script
script_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# The directory containing the photos
dir="$script_dir/../images/photos/"

# For each jpg file in the directory
for file in "$dir"*.jpg
do
    # Get the filename
    filename=$(basename "$file")

    # Resize the image to a width of 1080 pixels, maintaining aspect ratio
    sips -Z 1080 "$file"
done

echo "Images resized."