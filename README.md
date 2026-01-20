# Simple Text Capture

A plugin for [Obsidian](https://obsidian.md).
"Simple Text Capture" allows you to quickly capture text into specific notes using customizable slots and templates. It is designed to be fast and unobtrusive.

## Features

- **Quick Capture**: Open a modal to type text quickly.
- **Multiple Slots**: Configure up to 5 different capture slots (e.g., for different daily notes, journals, or task lists).
- **Customizable Targets**: Specify which note and under which header the text should go.
- **Templates**: Define how the captured text is formatted using `{$input}` and `{{date}}` placeholders.
- **Custom Appearance**: Customize the modal and input area background colors to match your theme.

## Installation

### Manual Installation

1. Download the latest release from the [releases page](https://github.com/obsidianmd/obsidian-sample-plugin/releases).
2. Extract the `main.js`, `manifest.json`, and `styles.css` files.
3. Create a folder named `simple-text-capture` in your vault's `.obsidian/plugins/` directory.
4. Place the extracted files into that folder.
5. Reload Obsidian and enable the plugin in Settings > Community Plugins.

## Usage

1. **Configure Slots**: Go to **Settings > Simple Text Capture**.
2. **Set Up a Slot**:
   - **Target Header**: Enter the header name (e.g., `## Daily Log`) where you want the text to be appended. If left empty, text is appended to the end of the file.
   - **Template**: Define the format.
     - `{$input}`: The text you type in the modal.
     - `{{date}}`: The current timestamp.
     - Example: `- [ ] {$input} (Measured at {{date}})`
3. **Assign Hotkeys**:
   - Go to **Settings > Hotkeys**.
   - Search for "Simple Text Capture".
   - Assign a hotkey (e.g., `Win+Q` or `Cmd+Shift+D`) to "Capture (Slot 1)" etc.
4. **Capture**:
   - Press your hotkey.
   - Type your text in the modal.
   - Press `Enter` (or `Ctrl+Enter`) to save and close.
   - Press `Esc` to cancel.

## Settings

### Slots
Configure up to 5 slots with unique behaviors.

### Appearance
- **Modal Background Color**: Change the background color of the capture window.
- **Input Area Background Color**: Change the background of the text input box.
- **Reset Colors**: Restore the default dark theme colors.

## Development

1. Clone this repository.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start compilation in watch mode.

## License

MIT
