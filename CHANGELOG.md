# Change Log

All notable changes to the "markdown-ascii-tree" extension will be documented in this file.

## [1.2.0] - 2025-06-21

### Added

- Nice typography using Noto Sans font for content
- Markdown formatting support: **bold**, _italic_, and `code` rendering
- Subtle gray coloring for tree symbols (rgb(200, 200, 200))
- Monospace font for tree symbols ensuring perfect alignment
- Enhanced visual design with improved contrast and readability

### Improved

- Tree symbols now use proper double-dash format (├──, └──) for better alignment
- Separated font styling: monospace for tree structure, Noto Sans for content
- Better CSS organization and styling hierarchy
- Improved accessibility with better color contrast

### Removed

- Icon clutter: removed excessive symbols, keeping only original numbering for numbered lists

## [1.1.0] - 2025-06-21

### Added

- Support for bullet lists (-, \*, +) in tree structure
- Support for numbered lists (1., 2., 3.) in tree structure
- Support for paragraphs under headers in tree structure
- Proper indentation handling for nested lists

### Improved

- Enhanced parsing logic to handle multiple Markdown element types
- Better tree level assignment for different content types

## [1.0.0] - 2025-06-21

### Added

- Live ASCII tree preview for Markdown headers
- Real-time updates when editing Markdown files
- Proper text wrapping with hanging indentation
- Webview panel for clean preview display
- Command palette integration
- Editor title button for quick access (Markdown files only)
- Support for nested header structures up to 6 levels

### Features

- Parses Markdown headers (# to ######) and displays as ASCII tree
- Automatic refresh on document changes
- Maintains tree structure visual integrity with proper indentation
- Works with long header text and multi-line content
