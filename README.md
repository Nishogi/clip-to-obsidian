# Chrome to Obsidian Clipper

This project is a Chrome extension that allows you to clip web content and save it directly into Obsidian as a Markdown note.

## Features

- Clip the main content of any page.
- Convert HTML content to Markdown using the Turndown library.
- Extract and include metadata such as the title, author, publication date, and source URL.
- Generate a safe and compatible filename for Obsidian by removing special characters.

## Installation

1. Clone this repository or download the necessary files.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable `Developer mode` in the top right corner.
4. Click `Load unpacked` and select the folder containing the extension files.

## Usage

1. Open the web page you want to clip.
2. Click on the extension icon in the Chrome toolbar.
3. The content will be converted to Markdown and saved in Obsidian.

## How It Works

When the extension icon is clicked, the script executes the following steps:

1. Injects the required libraries (`readability.js` and `turndown.js`) into the current tab.
2. Runs a function to extract the main article content.
3. Converts the extracted HTML content to Markdown.
4. Constructs a Markdown note with the content and metadata (title, author, publication date, and source URL).
5. Saves the note in Obsidian.

## Libraries Used

- [Readability.js](https://github.com/mozilla/readability) - Used to extract the main content of a web page.
- [Turndown](https://github.com/domchristie/turndown) - Used to convert HTML content to Markdown.

## Contributing

Contributions are welcome! If you want to improve this project, please open an issue or submit a pull request.
