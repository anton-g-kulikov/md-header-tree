# ADR-001: Enhanced File Detection System

**Date**: 2025-06-21  
**Status**: Accepted  
**Context**: File recognition improvements for better user experience

## Context

Users reported that the extension was not recognizing some Markdown files, particularly those with non-standard extensions or files where VS Code failed to properly detect the language mode.

## Problem

The original implementation had several limitations:

1. **Strict Language ID Dependency**: Only worked when `document.languageId === "markdown"`
2. **Limited Extension Support**: Only recognized `.md` files in UI menus
3. **No Fallback Detection**: No content-based detection for edge cases
4. **Poor User Experience**: Unclear error messages when files weren't recognized

## Decision

We decided to implement a comprehensive file detection system:

### Key Components

1. **File Detection Module** (`src/fileDetection.ts`)

   - Centralized file detection logic
   - Multiple detection strategies
   - Comprehensive JSDoc documentation

2. **Multi-Extension Support**

   - Support for common Markdown extensions: `.md`, `.markdown`, `.mdown`, `.mkd`, `.mdwn`, `.mdtxt`, `.mdtext`, `.text`
   - Updated activation events and menu conditions

3. **Content-Based Detection**

   - Analyzes file content for Markdown patterns
   - Fallback for files without proper extensions
   - Pattern recognition for headers, lists, code blocks, links, emphasis

4. **Troubleshooting Command**
   - "Force Markdown Language Mode" command
   - Better error messages with guidance

### Implementation Strategy

- **Non-breaking**: All existing functionality preserved
- **Progressive Enhancement**: Better detection without breaking current workflows
- **Comprehensive Testing**: All scenarios covered by tests
- **Documentation**: Complete JSDoc and user documentation

## Consequences

### Positive

- **Better User Experience**: More files recognized automatically
- **Reduced Support Issues**: Clear troubleshooting options
- **Future-Proof**: Extensible detection system
- **Comprehensive Documentation**: Easy to maintain and extend

### Neutral

- **Slightly Larger Bundle**: Additional detection logic
- **More Complex**: Multiple detection strategies to maintain

### Risks Mitigated

- **Backward Compatibility**: All existing workflows continue to work
- **Performance**: Content analysis limited to first 50 lines
- **False Positives**: Conservative threshold for content-based detection

## Alternatives Considered

1. **VS Code Language Detection Only**: Rejected due to reliability issues
2. **Extension-Only Detection**: Rejected due to inflexibility
3. **User Configuration**: Rejected due to complexity for end users

## Implementation Notes

- All changes maintain backward compatibility
- Comprehensive test coverage added
- Documentation updated throughout
- Performance considerations addressed

## Future Considerations

- Monitor user feedback for additional extensions to support
- Consider configuration options for custom file patterns
- Potential integration with VS Code's file association settings
