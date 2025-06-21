# Markdown ASCII Tree

This VS Code extension adds a command to render the currently open Markdown file as an ASCII tree structure based on header levels with live preview.

## Features

- **Live ASCII Tree Preview**: Renders Markdown headers as an interactive ASCII tree structure
- **Real-time Updates**: Preview updates automatically as you edit your Markdown file
- **Proper Text Wrapping**: Long header text wraps correctly while maintaining tree structure
- **Clean Visual Design**: Displays in a dedicated webview panel alongside your editor

## Usage

1. Open a Markdown file in VS Code
2. Open the Command Palette (`Cmd+Shift+P` on macOS, `Ctrl+Shift+P` on Windows/Linux)
3. Run the command `Markdown: Show ASCII Header Tree`
4. A live preview panel will open showing your document structure as an ASCII tree
5. Edit your Markdown file - the tree updates automatically!

## Example

For a Markdown file with nested headers, you'll see output like:

```
└─ My Project
   ├─ Introduction
   │  └─ Getting Started
   ├─ Features
   │  ├─ Core Features
   │  └─ Advanced Features
   └─ Documentation
```

## Installation

1. Install from the VS Code Marketplace
2. Or install locally: `npm install` then `npm run compile`
3. Press `F5` to run in Extension Development Host

## Development

- Built with TypeScript and the VS Code Extension API
- Uses webview panels for live preview functionality
- Implements proper CSS hanging indents for text wrapping

## License

MIT
