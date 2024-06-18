# Clip-to-Obsidian Chrome Extension Documentation

## Overview

Clip-to-Obsidian is a Chrome extension that allows users to clip content from a webpage directly into their Obsidian vault. This extension converts the content into Markdown format and saves it with appropriate metadata.

## Installation

### Prerequisites

- Google Chrome browser
- Obsidian application installed with a vault ready to use

### Steps

1. Clone or download the project repository.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" using the toggle switch in the top right corner.
4. Click on "Load unpacked" and select the directory containing the extension files (manifest.json, bookmarklet.js, background.js, and icons).

## Usage

1. Navigate to the webpage you want to clip content from.
2. Click on the Clip-to-Obsidian extension icon in the Chrome toolbar.
3. The content of the page will be processed and converted to Markdown, then saved to your specified Obsidian vault.

## Project Files

### manifest.json

Defines the extension's metadata and permissions.

### background.js

Listens for the extension icon click event and injects the `bookmarklet.js` script into the current tab.

### bookmarklet.js

Processes the webpage content, converts it to Markdown, and triggers the creation of a new note in Obsidian.

## Customization

### Vault Name

To change the vault where the content will be saved, update the `vault` variable in `bookmarklet.js`:

```
const vault = "your_vault_name";
```

### Folder Name

To change the folder within the vault where the content will be saved, update the `folder` variable in `bookmarklet.js`:

```
const folder = "your_folder_name/";
```

### Tags

Tags are automatically generated from the webpage's meta keywords. If you want to customize the tags, you can modify the `tags` variable and the logic inside `bookmarklet.js`:

```
let tags = "";
```

## License

This project is licensed under the MIT License. See the LICENSE file for more information.

## Support

For any issues or questions, please contact the project maintainers or visit the homepage at [Obsidian](https://obsidian.md).