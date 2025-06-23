# Change Log

All notable changes to the "markdown-hierarchy-viewer" extension will be documented in this file.

## [1.3.0] - 2025-06-24

### ✨ New Features

- **🔗 Standard Markdown Link Rendering**: Added support for clickable links in markdown preview
  - Supports inline links: `[text](url)`
  - Supports reference-style links: `[text][ref]` with `[ref]: url` definitions
  - Includes proper CSS styling with hover effects and theme awareness
  - Nested formatting support (bold, italic, code) within link text
  - HTML escaping for security against XSS attacks
  - Handles complex URLs with parentheses using balanced parsing algorithm
  - 45+ comprehensive unit and integration tests ensuring reliability

## [1.2.0] - 2025-06-21

### ✨ Enhanced Customization

- **🎨 Configurable Header Font Weights**: Added individual font weight controls for each header level (H1-H6)
  - New VS Code settings: `markdownHierarchyViewer.headerStyling.h1FontWeight` through `h6FontWeight`
  - Default: H1-H2 are bold (600), H3-H6 are normal (400) for better visual hierarchy
  - Supports all CSS font-weight values (100-900, normal, bold, etc.)
  - Real-time configuration updates without restart required

### 🔧 Developer Improvements

- **🧪 Enhanced Test Coverage**: Added comprehensive tests for configuration-driven styling
- **📚 Improved Documentation**: Updated README with detailed header styling customization guide
- **🏗️ Better Architecture**: Refactored StyleManager to use configuration-driven CSS generation

## [1.1.1] - 2025-06-21

### 🎨 UI Improvements & Package Optimization

- **🎯 Custom Icons**: Added custom SVG icons for commands and webview panel with light/dark theme variants
- **📋 Context-aware Menus**: Implemented conditional menu display based on active webview state
- **🔧 Task Configuration Fix**: Fixed VS Code task configuration problem matchers to resolve task provider errors
- **📦 Clean Package**: Improved extension package by excluding development files
- **📚 Documentation**: Enhanced icon testing documentation and development guides

## [1.1.0] - 2025-06-21

### 🔍 Enhanced File Detection

- **📁 Expanded File Support**: Added support for multiple Markdown file extensions
  - Now supports `.md`, `.markdown`, `.mdown`, `.mkd`, `.mdwn`, `.mdtxt`, `.mdtext`, `.text`
  - Content-based detection for files without proper extensions
  - Improved activation events to handle various Markdown file patterns
- **🛠️ Better File Recognition**: Enhanced file detection logic
  - New `fileDetection.ts` module with intelligent Markdown content analysis
  - Fallback detection for edge cases where VS Code doesn't properly identify Markdown files
  - Analysis of Markdown patterns (headers, lists, code blocks, links, emphasis)
- **⚡ New Commands**: Added utility command for troubleshooting
  - "Markdown: Force Markdown Language Mode" - Manually set files to Markdown mode
  - Improved error messages with more helpful guidance
- **🎯 Menu Improvements**: Updated editor menu conditions to support all Markdown extensions
- **📖 Documentation**: Updated README and project documentation with troubleshooting guide

## [1.0.2] - 2025-06-21

### 🚀 Publishing Ready

- **📦 Marketplace Preparation**: Extension is now ready for VS Code Marketplace publication
  - Added extension icon (icon.png) for marketplace visibility
  - Configured gallery banner with dark theme color (#2E3440)
  - Created comprehensive SUPPORT.md for user assistance
  - Updated VS Code engine requirement to ^1.101.0 for latest API compatibility
- **📚 Documentation Enhancements**: Improved project documentation and publishing guidelines
  - Added detailed publishing checklist and guidelines
  - Enhanced README with accurate version information
  - Comprehensive support documentation with troubleshooting guides
- **🔧 Configuration Improvements**: Enhanced marketplace presentation
  - Professional gallery banner configuration
  - Optimized extension metadata for better discoverability

## [1.0.1] - 2025-06-21

### 🔧 Improvements

- **📁 Enhanced Project Structure**: Reorganized documentation and testing structure
  - Created comprehensive project documentation in `/meta` folder
  - Added detailed test documentation and test case tracking
  - Improved development guidelines and coding instructions
- **🧪 Testing Enhancements**: Expanded test coverage and documentation
  - Added integration tests for parser functionality
  - Enhanced unit test structure and organization
  - Implemented comprehensive test case tracking system
- **📚 Documentation Updates**: Improved project documentation and organization
  - Added project-specific documentation files
  - Enhanced development and publishing guidelines
  - Better organized assets and documentation structure
- **🛠️ Development Experience**: Improved development workflow and structure
  - Better organized project folders and files
  - Enhanced ESLint configuration and TypeScript setup
  - Improved gitignore configuration

## [1.0.0] - 2025-06-21

### 🎉 Initial Release

#### ✨ Features

- **🌳 Live Tree Preview**: Real-time visualization of Markdown document structure
- **📝 Complete Element Support**: Headers, bullet lists, numbered lists, paragraphs, and code blocks
- **⚡ Real-time Updates**: Instant preview updates as you edit (debounced for performance)
- **🎨 Beautiful Typography**: Noto Sans for content with perfectly aligned monospace tree symbols
- **🎯 Markdown Formatting**: Renders **bold**, _italic_, and `code` formatting within the tree
- **🔧 Fully Customizable**: Configure colors, fonts, symbols, and styling
- **🛡️ Secure & Robust**: Built with XSS protection, error handling, and memory management

#### 🚀 Commands

- **Markdown: Show Hierarchy Viewer** - Open the tree preview
- **Markdown: Refresh Hierarchy Viewer** - Refresh the current preview
- **Markdown Hierarchy Viewer: Show Logs** - View extension logs for debugging

#### ⚙️ Configuration

Comprehensive settings for customizing:

- Tree symbols (branch, last, vertical)
- Colors (tree symbols, content, background)
- Typography (content font, tree symbol font)
- Layout (line height, padding)

#### 🏗️ Technical

- Built with TypeScript and modern VS Code Extension API
- Modular architecture with proper separation of concerns
- Comprehensive error handling and logging
- Memory management and proper resource cleanup
- Unit tests and development documentation
