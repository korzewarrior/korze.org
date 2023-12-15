# script.py
import re

def update_version():
    with open("elements/footer.html", "r") as file:
        content = file.read()

    # Extract the current version number from the content
    version_pattern = re.compile(r'Version: (\d+\.\d+\.\d+)')
    match = version_pattern.search(content)

    if match:
        # If a version number is found, increment the patch version
        current_version = match.group(1).split('.')
        new_patch_version = int(current_version[-1]) + 1
        new_version = '.'.join(current_version[:-1] + [str(new_patch_version)])
    else:
        # If no version number is found, start at 1.0.0
        new_version = '1.0.0'

    # Replace or append the version number in the content
    new_version_text = f'© 2023 Korze. All rights reserved. Version: {new_version}'
    new_content = re.sub(r'(© 2023 Korze\. All rights reserved\.)( Version: \d+\.\d+\.\d+)?', new_version_text, content)

    with open("elements/footer.html", "w") as file:
        file.write(new_content)

if __name__ == "__main__":
    update_version()
