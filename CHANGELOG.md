# Change Log

All notable changes to the "markdown-hierarchy-viewer" extension will be documented in this file.

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
