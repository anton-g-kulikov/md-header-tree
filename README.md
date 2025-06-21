# Markdown Hierarchy Viewer

A professional VS Code ext\*Note: In the## 📋 Example

For a Markdown file with all header levels, lists, and paragraphs, you'll see output like:

```
└── My Complete Project Documentation
   ├── Introduction
   │  ├── This is an **introduction** paragraph explaining the project.
   │  └── Getting Started
   │     ├── Installation Guide
   │     │  ├── Prerequisites
   │     │  │  ├── System Requirements
   │     │  │  │  └── Hardware Specifications
   │     │  │  │     └── Minimum RAM and CPU requirements for optimal performance.
   │     │  │  ├── Install dependencies using `npm install`
   │     │  │  ├── Configure `settings.json` file
   │     │  │  └── 1. Run the application
   │     │  │     └── 2. Test the setup
   │     │  └── Basic Configuration
   │     │     ├── Environment variables
   │     │     └── Database connection settings
   │     └── Quick Start Tutorial
   │        └── Follow these steps to get up and running quickly.
   ├── Features
   │  ├── Here are the *main features* of our project.
   │  ├── Core Features
   │  │  ├── Authentication system
   │  │  ├── User management
   │  │  └── Data processing
   │  └── Advanced Features
   │     ├── Real-time synchronization
   │     └── Advanced analytics dashboard
   └── Documentation
      └── API Reference
```

### Test Markdown Structure

Here's a complete test structure you can use to verify all header levels:

```markdown
# Level 1 - Main Title

This is the main document introduction with **bold text** and _italic text_.

## Level 2 - Major Section

A major section with some `inline code`.

- Bullet point 1
- Bullet point 2

### Level 3 - Subsection

Content for the subsection.

1. Numbered item 1
2. Numbered item 2
   - Nested bullet
   - Another nested bullet

#### Level 4 - Sub-subsection

Fourth level header content.

##### Level 5 - Deep Section

Fifth level header with detailed information.

###### Level 6 - Deepest Level

The deepest supported header level in Markdown.

- Final bullet point
- With some **formatting** and `code`
```

*Note: In the actual preview, tree symbols appear in subtle gray while content is displayed in black with proper formatting.*e symbols appear in subtle gray while content is displayed in black with proper formatting.\*

## ⚙️ Configuration

Customize the extension through VS Code settings (`Cmd+,` → search for "Markdown Hierarchy Viewer"):

```json
{
  // Tree symbols
  "markdownAsciiTree.treeSymbols.branch": "├──",
  "markdownAsciiTree.treeSymbols.last": "└──",
  "markdownAsciiTree.treeSymbols.vertical": "│",

  // Colors
  "markdownAsciiTree.colors.treeSymbols": "rgb(200, 200, 200)",
  "markdownAsciiTree.colors.content": "rgb(0, 0, 0)",
  "markdownAsciiTree.colors.background": "rgb(246, 246, 246)",

  // Typography
  "markdownAsciiTree.fonts.content": "'Noto Sans', Arial, sans-serif",
  "markdownAsciiTree.fonts.treeSymbols": "'SF Mono', Consolas, monospace",

  // Layout
  "markdownAsciiTree.styling.lineHeight": 1.6,
  "markdownAsciiTree.styling.padding": "4em"
}
```

## 🎮 Commands

- **Markdown: Show Header Tree** - Open the tree preview
- **Markdown: Refresh ASCII Tree** - Refresh the current preview
- **Markdown Hierarchy Viewer: Show Logs** - View extension logs for debuggingnsion that renders Markdown files as beautiful, live ASCII tree structures with comprehensive customization options and robust architecture.

## ✨ Features

- **🌳 Live ASCII Tree Preview**: Real-time visualization of Markdown structure
- **📝 Multiple Element Support**: Headers, bullet lists, numbered lists, and paragraphs
- **⚡ Real-time Updates**: Instant preview updates as you edit (debounced for performance)
- **🎨 Beautiful Typography**: Noto Sans font with perfectly aligned monospace tree symbols
- **🎯 Markdown Formatting**: Renders **bold**, _italic_, and `code` formatting
- **🔧 Fully Customizable**: Configure colors, fonts, symbols, and styling
- **🛡️ Secure & Robust**: XSS protection, error handling, and memory management
- **📊 Professional Architecture**: Modular, testable, and maintainable codebase
- **🚫 Code Block Support**: Renders fenced (```) and indented code blocks as preformatted content at proper tree levels

## 🚀 Quick Start

1. Install the extension from the VS Code Marketplace
2. Open any Markdown file
3. Use `Cmd+Shift+P` → "Markdown: Show Header Tree"
4. Watch your document structure come alive! 🎉

## Usage

1. Open a Markdown file in VS Code
2. Open the Command Palette (`Cmd+Shift+P` on macOS, `Ctrl+Shift+P` on Windows/Linux)
3. Run the command `Markdown: Show Header Tree`
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
3. Search for "Markdown Hierarchy Viewer"
4. Click Install

### From Command Line

```bash
code --install-extension your-publisher.markdown-hierarchy-viewer
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

### Project Structure

```
├── src/                    # Extension source code
├── test/                   # Testing suite
│   ├── fixtures/          # Test Markdown files
│   ├── unit.test.ts       # Unit tests
│   └── extension.test.ts  # Integration tests
├── meta/                   # Project documentation
│   ├── DEVELOPMENT.md     # Architecture guide
│   ├── PUBLISHING.md      # Publishing instructions
│   └── README.md          # Meta directory guide
├── CHANGELOG.md           # Release notes
└── README.md              # This file
```

## Requirements

- VS Code 1.74.0 or higher

## Extension Settings

This extension contributes the following commands:

- `markdown-hierarchy-viewer.showAsciiTree`: Show Header Tree for the current Markdown file

## License

MIT
