#!/bin/bash

# Get the directory of the script
script_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# The directory containing the photos
dir="$script_dir/../images/photos/"

# The output directory
output_dir="$script_dir/../elements/"

# The output HTML file
output_file="photogrid.html"

echo "Starting script..."

# Print the current working directory
echo "Current directory: $script_dir"

# Check if the output directory exists
if [ ! -d "$output_dir" ]; then
    # If the directory doesn't exist, create it
    echo "Output directory does not exist. Creating it..."
    mkdir -p "$output_dir"
fi

# Check if the output file exists
if [ ! -f "$output_dir$output_file" ]; then
    # If the file doesn't exist, create it
    echo "Output file does not exist. Creating it..."
    touch "$output_dir$output_file"
fi

# Print the full path to the output file
echo "Output file: $output_dir$output_file"

# Start the HTML file
echo "Starting HTML file..."
echo "<div class='photo-grid'>" > "$output_dir$output_file"

# For each jpg file in the directory
echo "Adding photos to HTML file..."
for file in "$dir"*.jpg
do
    # Get the filename
    filename=$(basename "$file")

    # URL encode spaces in the filename
    filename_url_encoded=${filename// /%20}

    # Add a link to the photo to the HTML file
    echo "Adding $filename..."
    echo "<a href='/images/photos/$filename_url_encoded' target='_blank'><img src='/images/photos/$filename_url_encoded' alt='$filename'></a>" >> "$output_dir$output_file"
done

# End the HTML file
echo "Ending HTML file..."
echo "</div>" >> "$output_dir$output_file"

echo "Script finished."