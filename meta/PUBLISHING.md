# Publishing Guide

This guide explains how to publish the Markdown Hierarchy Viewer extension to the VS Code Marketplace.

## Prerequisites

1. Install the Visual Studio Code Extension Manager (vsce):

   ```bash
   npm install -g @vscode/vsce
   ```

2. Create a publisher account at [Visual Studio Marketplace](https://marketplace.visualstudio.com/manage)

3. Get a Personal Access Token from [Azure DevOps](https://dev.azure.com/) with Marketplace permissions

## Before Publishing

1. **Update package.json**:

   - Change `publisher` field from "your-publisher-name" to your actual publisher name
   - Update repository URLs if hosting on GitHub
   - Ensure version number is correct
   - **ADD ICON**: Add `"icon": "icon.png"` property (REQUIRED)

2. **Create Required Files**:

   - **ICON**: Create `icon.png` (128x128px minimum, PNG format) in root directory
   - Ensure `LICENSE` file exists
   - Verify `CHANGELOG.md` is updated
   - Consider adding `SUPPORT.md` for user support information

3. **Test the extension**:

   ```bash
   npm run compile
   npm run lint
   ```

4. **Test in Extension Development Host**:
   - Press `F5` in VS Code to launch Extension Development Host
   - Open a Markdown file and test the command "Markdown: Show ASCII Header Tree"

## Publishing Steps

1. **Login to vsce**:

   ```bash
   vsce login your-publisher-name
   ```

2. **Package the extension** (optional, for testing):

   ```bash
   vsce package
   ```

   This creates a `.vsix` file that you can install locally for testing.

3. **Publish to Marketplace**:
   ```bash
   vsce publish
   ```

## Post-Publishing

1. The extension will be available in the VS Code Marketplace within a few minutes
2. Users can install it via:
   - VS Code Extensions view (Ctrl/Cmd+Shift+X)
   - Command line: `code --install-extension your-publisher.markdown-hierarchy-viewer`

## Version Updates

For future updates:

1. Update the version in `package.json`
2. Update `CHANGELOG.md` with new features/fixes
3. Compile and test: `npm run compile && npm run lint`
4. Publish: `vsce publish`

## Useful Commands

- `vsce package` - Create a .vsix package file
- `vsce publish patch` - Auto-increment patch version and publish
- `vsce publish minor` - Auto-increment minor version and publish
- `vsce publish major` - Auto-increment major version and publish
- `vsce unpublish your-publisher.markdown-hierarchy-viewer` - Remove from marketplace

## Files Included in Package

The `.vscodeignore` file excludes development files. The published extension includes:

- Compiled JavaScript (`out/`)
- `package.json`
- `README.md`
- `CHANGELOG.md`
- `LICENSE` (if present)
- **`icon.png`** (REQUIRED - extension icon, 128x128px minimum)

## Marketing Tips

- **Add an extension icon** (PNG, 128x128px minimum) - REQUIRED for publication
- Add screenshots to README.md showing the extension in action
- Use relevant keywords in package.json (max 30 keywords)
- Write clear, concise descriptions
- Consider adding `galleryBanner.color` for custom marketplace background
- Add animated GIFs demonstrating features
- Respond to user issues and feedback on the marketplace

## 🚨 CRITICAL: Icon Requirement

**Your extension CANNOT be published without an icon!**

1. Create a PNG file named `icon.png` with minimum 128x128 pixels
2. Place it in the root directory of your project
3. Add this to your `package.json`:
   ```json
   {
     "icon": "icon.png"
   }
   ```

**Icon Design Tips:**

- Use simple, recognizable symbols related to your extension
- Consider a tree/hierarchy theme for your Markdown viewer
- Ensure good contrast and visibility at small sizes
- Follow VS Code's design guidelines for consistency
