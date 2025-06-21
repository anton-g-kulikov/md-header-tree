# Change Log

All notable changes to the "markdown-hierarchy-viewer" extension will be documented in this file.

## [2.0.0] - 2025-06-21

### 🚀 Major Refactoring - Professional Architecture

#### Added

- **Modular Architecture**: Separated code into logical modules for maintainability
- **TypeScript Interfaces**: Comprehensive type definitions for all data structures
- **Configuration System**: User-customizable settings for colors, fonts, and symbols
- **Professional Logging**: Structured logging with output channel integration
- **Error Handling**: Robust error handling with graceful degradation
- **Memory Management**: Proper cleanup and disposal of resources
- **Security**: Content Security Policy and XSS prevention
- **Unit Tests**: Test coverage for core functionality
- **Additional Commands**: Refresh and show logs commands
- **Development Documentation**: Comprehensive architecture and development guides
- **Code Block Support**: Full support for fenced (```) and indented code blocks with proper content preservation and styling

#### Improved

- **Performance**: Debounced updates and efficient parsing algorithms
- **Code Quality**: ESLint passing, proper TypeScript usage
- **Extensibility**: Easy to add new features and configuration options
- **User Experience**: Better error messages and feedback
- **Maintainability**: Clean separation of concerns and single responsibility
- **Parser Robustness**: Code blocks are now properly rendered as preformatted content at correct tree levels, with custom scrollbar styling
- **Styling Enhancements**: Improved visual presentation with custom scrollbars and better code block formatting
- **Project Organization**: Clean project structure with dedicated test/ and meta/ directories

#### Technical Improvements

- Separated CSS from JavaScript logic
- Implemented proper dependency injection
- Added configuration hot-reloading
- Improved tree rendering with better error handling
- Enhanced webview lifecycle management
- Added proper TypeScript type checking
- Organized project files into logical directories
- Fixed code block parsing to prevent recursive parsing of examples

#### Fixed

- **Code Block Recursion**: Fixed issue where ASCII tree examples in README were being parsed as actual structure
- **Memory Leaks**: Proper cleanup of event listeners and disposables
- **Test Environment**: Logger now works properly in test environment

### Breaking Changes

- Extension now requires VS Code 1.74.0 or higher
- Configuration structure has changed (automatic migration)

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
