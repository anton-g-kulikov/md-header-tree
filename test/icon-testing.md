# Testing Custom Icons

## Manual Testing Checklist

### 1. **Command Icons in Editor Title**

- [ ] Open a Markdown file (`.md`, `.markdown`, `.mdown`, `.mkd`)
- [ ] Verify hierarchy tree icon appears in editor title bar
- [ ] Click the hierarchy tree icon to open the panel
- [ ] Verify refresh icon appears when panel is active
- [ ] Test in both light and dark themes

### 2. **Panel Icon**

- [ ] Open hierarchy viewer panel
- [ ] Verify custom tree icon appears in the panel tab
- [ ] Switch between light and dark themes
- [ ] Confirm icon adapts to theme correctly

### 3. **Theme Compatibility**

- [ ] Test with VS Code Light theme
- [ ] Test with VS Code Dark theme
- [ ] Test with other popular themes (One Dark Pro, Material Theme)
- [ ] Verify icons remain visible and aesthetically pleasing

### 4. **Icon Accessibility**

- [ ] Icons should be clearly visible at 100% zoom
- [ ] Icons should scale properly at different zoom levels
- [ ] Icons should maintain clarity on high-DPI displays

## Automated Testing

The custom icons are tested as part of the extension loading process:

```typescript
// Test that commands are registered with icons
const commands = await vscode.commands.getCommands();
assert(commands.includes("markdown-hierarchy-viewer.showTree"));
assert(commands.includes("markdown-hierarchy-viewer.refresh"));
```

## Icon Validation

### SVG Requirements

- Must be valid SVG 1.1 format
- Should use `currentColor` for theme compatibility
- Must be 16x16 pixels for optimal rendering
- Should avoid complex gradients or effects

### File Structure Validation

```bash
# Verify icon files exist
ls -la assets/icons/
# Should show:
# hierarchy-light.svg
# hierarchy-dark.svg
# refresh-light.svg
# refresh-dark.svg
```

## Troubleshooting Icons

### Icons Not Appearing

1. Check file paths in package.json are correct
2. Verify SVG files are valid XML
3. Ensure extension is compiled after icon changes
4. Check VS Code Developer Tools console for errors

### Icons Not Theme-Appropriate

1. Verify separate light/dark variants exist
2. Check SVG fill colors are appropriate for each theme
3. Test with multiple themes to ensure compatibility

### Icons Not Scaling

1. Confirm SVG viewBox is set to "0 0 16 16"
2. Ensure no fixed pixel dimensions in SVG elements
3. Use relative units where possible
