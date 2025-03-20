# My Chrome Extension

A basic Chrome extension with popup functionality that demonstrates core extension features like background services, popup UI, and message passing.

## Features

- Interactive popup UI with action button
- Background service worker for persistent functionality
- Storage capabilities to maintain state between sessions
- Message passing between popup and background contexts

## Installation

### For Developers

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/my-chrome-extension.git
   cd my-chrome-extension
   ```

2. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" by toggling the switch in the top right corner
   - Click "Load unpacked" and select the extension directory
   - The extension should now appear in your browser toolbar

### For Users (When Published)

1. Visit the Chrome Web Store page for this extension
2. Click "Add to Chrome"
3. Confirm the installation when prompted

## Usage

1. Click on the extension icon in the Chrome toolbar to open the popup
2. Use the "Click Me" button to interact with the extension
3. The popup will display the number of times you've clicked the button
4. The extension maintains count between browser sessions

## Project Structure

```
my-chrome-extension/
│
├── manifest.json       # Extension configuration and metadata
├── popup.html         # HTML structure for the popup UI
├── popup.js           # JavaScript for popup functionality
├── background.js      # Background service worker script
├── styles.css         # CSS styling for the extension UI
│
└── icons/             # Extension icons in different sizes
    ├── icon16.png     # 16×16 icon (favicon, toolbar)
    ├── icon48.png     # 48×48 icon (Chrome Web Store)
    └── icon128.png    # 128×128 icon (installation and Chrome Web Store)
```

## Development Setup

### Prerequisites

- Chrome browser (latest version recommended)
- Basic knowledge of HTML, CSS, and JavaScript
- Text editor or IDE (VS Code recommended)

### Development Workflow

1. Make changes to the extension files
2. Reload the extension in Chrome:
   - Navigate to `chrome://extensions/`
   - Find your extension and click the refresh icon
   - Or click the "Update" button if using Chrome's developer tools

3. For testing background script changes:
   - Background service workers automatically restart when changes are detected
   - Check the "Inspect views: service worker" link on the extension card for logs

4. For debugging:
   - Right-click the extension icon and select "Inspect popup" to debug the popup
   - Use the service worker inspector (from extensions page) to debug background scripts
   - Check the browser console for any errors or logs

### Building for Production

When ready to publish your extension:

1. Remove any unnecessary development files
2. Verify the manifest.json contains correct information
3. Create a ZIP archive of the extension directory
4. Upload to the Chrome Web Store Developer Dashboard

## License

[Add your license information here]

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.