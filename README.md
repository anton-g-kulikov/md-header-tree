# Markdown ASCII Tree

This VS Code extension renders the currently open Markdown file as a live ASCII tree structure, visualizing headers, paragraphs, and lists with beautiful typography and real-time updates.

## Features

- **Live ASCII Tree Preview**: Renders Markdown headers, paragraphs, and lists as an interactive ASCII tree structure
- **Multiple Element Types**: Supports headers (# to ######), bullet lists (- \* +), numbered lists (1. 2. 3.), and paragraphs
- **Real-time Updates**: Preview updates automatically as you edit your Markdown file
- **Nice Typography**: Uses Noto Sans font for content with monospace tree symbols for perfect alignment
- **Markdown Formatting**: Renders **bold**, _italic_, and `code` formatting within the tree
- **Subtle Tree Styling**: Gray tree symbols with black content for optimal readability
- **Proper Text Wrapping**: Long text wraps correctly while maintaining tree structure
- **Original Numbering**: Preserves original numbers from numbered lists (1. 2. 3. etc.)
- **Clean Visual Design**: Displays in a dedicated webview panel alongside your editor

## Usage

1. Open a Markdown file in VS Code
2. Open the Command Palette (`Cmd+Shift+P` on macOS, `Ctrl+Shift+P` on Windows/Linux)
3. Run the command `Markdown: Show ASCII Header Tree`
4. A live preview panel will open showing your document structure as an ASCII tree
5. Edit your Markdown file - the tree updates automatically!

## Example

For a Markdown file with nested headers, lists, and paragraphs, you'll see output like:

```
└── My Project
   ├── Introduction
   │  ├── This is an **introduction** paragraph explaining the project.
   │  └── Getting Started
   │     ├── Install dependencies
   │     ├── Configure `settings.json`
   │     └── 1. Run the application
   ├── Features
   │  ├── Here are the *main features* of our project.
   │  ├── Core Features
   │  └── Advanced Features
   └── Documentation
```

_Note: In the actual preview, tree symbols appear in subtle gray while content is displayed in black with proper formatting._

## Installation

### From VS Code Marketplace

1. Open VS Code
2. Go to Extensions (Ctrl/Cmd+Shift+X)
3. Search for "Markdown ASCII Tree"
4. Click Install

### From Command Line

```bash
code --install-extension your-publisher.markdown-ascii-tree
```

### Development Installation

1. Clone this repository
2. Run `npm install`
3. Run `npm run compile`
4. Press `F5` to run in Extension Development Host

## Development

- Built with TypeScript and the VS Code Extension API
- Uses webview panels for live preview functionality
- Implements proper CSS hanging indents for text wrapping
- Combines monospace fonts for tree structure with Noto Sans for content
- Real-time document change detection for live updates

## Requirements

- VS Code 1.74.0 or higher

## Extension Settings

This extension contributes the following commands:

- `markdown-ascii-tree.showAsciiTree`: Show ASCII Header Tree for the current Markdown file

## License

MIT
