# Development Documentation

## Architecture Overview

The Markdown Hierarchy Viewer extension follows a modular, professional architecture with clear separation of concerns:

### Core Components

#### 1. **extension.ts** - Main Entry Point

- Extension activation/deactivation lifecycle
- Minimal bootstrapping logic
- Error handling for the entire extension

#### 2. **types.ts** - Type Definitions

- TypeScript interfaces for all data structures
- Type safety across the entire codebase
- Clear contracts between modules

#### 3. **configuration.ts** - Configuration Management

- Centralized configuration handling
- VS Code settings integration
- Configuration change detection

#### 4. **logger.ts** - Logging System

- Structured logging with timestamps
- Multiple log levels (info, warn, error)
- Output channel integration for user debugging

#### 5. **markdownParser.ts** - Markdown Processing

- Document parsing logic
- Tree structure building
- Markdown formatting (bold, italic, code)
- XSS prevention through HTML escaping

#### 6. **treeRenderer.ts** - Tree Visualization

- ASCII tree rendering
- Configurable symbols and styling
- Error state handling

#### 7. **styleManager.ts** - CSS/HTML Generation

- Separation of styling from logic
- Dynamic CSS generation based on configuration
- Content Security Policy compliance

#### 8. **webviewManager.ts** - Webview Lifecycle

- Webview panel management
- Document change detection with debouncing
- Memory leak prevention
- Configuration hot-reloading

#### 9. **commandManager.ts** - Command Handling

- VS Code command registration
- Error handling and user feedback
- Command validation

## Design Patterns Used

### 1. **Separation of Concerns**

Each module has a single, well-defined responsibility.

### 2. **Dependency Injection**

Components receive their dependencies through constructors.

### 3. **Observer Pattern**

Configuration changes and document updates trigger appropriate responses.

### 4. **Factory Pattern**

StyleManager generates HTML/CSS based on configuration.

### 5. **Singleton Pattern**

Logger and ConfigurationManager maintain single instances.

## Best Practices Implemented

### 1. **Error Handling**

- Try-catch blocks around all major operations
- User-friendly error messages
- Detailed logging for debugging
- Graceful degradation when parsing fails

### 2. **Memory Management**

- Proper disposal of event listeners
- Cleanup on extension deactivation
- Debounced updates to prevent excessive processing

### 3. **Security**

- Content Security Policy for webviews
- HTML escaping to prevent XSS
- No script execution in webviews

### 4. **Performance**

- Debounced document updates (300ms)
- Efficient tree building algorithms
- Minimal DOM updates

### 5. **Extensibility**

- Configuration-driven behavior
- Pluggable tree symbols and colors
- Easy to add new Markdown element types

### 6. **Testing**

- Unit tests for core functionality
- Testable architecture with dependency injection
- Mock-friendly interfaces

## Configuration Options

Users can customize the extension through VS Code settings:

```json
{
  "markdownAsciiTree.treeSymbols.branch": "├──",
  "markdownAsciiTree.treeSymbols.last": "└──",
  "markdownAsciiTree.colors.treeSymbols": "rgb(200, 200, 200)",
  "markdownAsciiTree.fonts.content": "'Noto Sans', Arial, sans-serif"
}
```

## Adding New Features

### Adding a New Markdown Element Type

1. Add the type to `ElementType` in `types.ts`
2. Update parsing logic in `markdownParser.ts`
3. Update rendering logic in `treeRenderer.ts`
4. Add tests in `test/unit.test.ts`

### Adding New Configuration Options

1. Update `ExtensionConfig` interface in `types.ts`
2. Add settings to `package.json` contributions
3. Update `ConfigurationManager.getConfiguration()`
4. Use the new setting in relevant components

## Performance Considerations

### 1. **Debouncing**

Document changes are debounced to prevent excessive re-rendering during fast typing.

### 2. **Efficient Parsing**

Single-pass document parsing with regex matching.

### 3. **Memory Management**

Proper cleanup of event listeners and disposables.

### 4. **CSS Generation**

CSS is generated once per configuration change, not per update.

## Security Considerations

### 1. **Content Security Policy**

Webviews use strict CSP to prevent script execution.

### 2. **HTML Escaping**

All user content is HTML-escaped to prevent XSS attacks.

### 3. **Resource Restrictions**

Webviews can only load fonts from trusted sources.

## Error Handling Strategy

### 1. **Graceful Degradation**

If parsing fails, show a user-friendly error message instead of crashing.

### 2. **Detailed Logging**

All errors are logged with context for debugging.

### 3. **User Feedback**

Users receive clear error messages with actionable advice.

### 4. **Recovery**

Extension continues to work even if individual operations fail.

## Testing Strategy

### 1. **Unit Tests**

Test individual functions and classes in isolation.

### 2. **Integration Tests**

Test component interactions and VS Code API integration.

### 3. **Manual Testing**

Test user workflows and edge cases manually.

### 4. **Error Path Testing**

Verify error handling with malformed input.

## Deployment Checklist

- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] Extension compiles successfully
- [ ] Manual testing in Extension Development Host
- [ ] Version updated in package.json
- [ ] CHANGELOG.md updated
- [ ] README.md reflects current features
- [ ] Configuration documentation is current

## Custom Icon Implementation

The extension uses custom SVG icons to provide a consistent visual identity across different VS Code themes.

### Icon System Architecture

#### 1. **Command Icons**

Commands in the editor title bar use custom SVG icons with theme-aware variants:

```json
{
  "command": "markdown-hierarchy-viewer.showTree",
  "icon": {
    "light": "./assets/icons/hierarchy-light.svg",
    "dark": "./assets/icons/hierarchy-dark.svg"
  }
}
```

#### 2. **Panel Icon**

The webview panel itself displays a custom icon in the tab:

```typescript
this.panel.iconPath = {
  light: vscode.Uri.file(
    this.context.asAbsolutePath("assets/icons/hierarchy-light.svg")
  ),
  dark: vscode.Uri.file(
    this.context.asAbsolutePath("assets/icons/hierarchy-dark.svg")
  ),
};
```

#### 3. **Context-Aware Menu Items**

Menu items appear conditionally based on extension state:

- **Show Tree**: Appears for Markdown files (`.md`, `.markdown`, `.mdown`, `.mkd`)
- **Refresh**: Only appears when the hierarchy viewer panel is active

### Icon Design Guidelines

#### 1. **Size and Format**

- **Size**: 16x16 pixels for optimal clarity
- **Format**: SVG for scalability and theme compatibility
- **Colors**: Use `currentColor` or theme-specific colors

#### 2. **Theme Support**

- **Light Theme**: Darker colors for contrast
- **Dark Theme**: Lighter colors with accent highlights

#### 3. **Visual Consistency**

- Icons follow VS Code's design language
- Maintain visual hierarchy and clarity
- Use semantic colors (blue for interactive elements)

### Adding New Icons

1. **Create SVG Files**:

   ```
   assets/icons/
   ├── new-feature-light.svg
   └── new-feature-dark.svg
   ```

2. **Update package.json**:

   ```json
   {
     "command": "extension.newFeature",
     "icon": {
       "light": "./assets/icons/new-feature-light.svg",
       "dark": "./assets/icons/new-feature-dark.svg"
     }
   }
   ```

3. **Use in Code** (for panels):
   ```typescript
   panel.iconPath = {
     light: vscode.Uri.file(
       context.asAbsolutePath("assets/icons/new-feature-light.svg")
     ),
     dark: vscode.Uri.file(
       context.asAbsolutePath("assets/icons/new-feature-dark.svg")
     ),
   };
   ```

### Icon Assets Structure

```
assets/icons/
├── hierarchy-light.svg    # Main tree structure icon (light theme)
├── hierarchy-dark.svg     # Main tree structure icon (dark theme)
├── refresh-light.svg      # Refresh command icon (light theme)
└── refresh-dark.svg       # Refresh command icon (dark theme)
```
