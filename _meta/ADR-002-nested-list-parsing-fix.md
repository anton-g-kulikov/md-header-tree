# ADR-002: Nested List Parsing Priority Fix

**Date**: 2025-07-05  
**Status**: Accepted  
**Decision Makers**: Development Team

## Context

The Markdown Hierarchy Viewer extension was incorrectly parsing deeply nested list items (3rd and 4th level with 4+ spaces indentation) as code blocks instead of list items. This occurred because the indented code block detection (lines starting with 4+ spaces) was taking precedence over list item detection, causing nested lists to be rendered incorrectly in the tree view.

### Problem Statement

- 3rd level nested lists (4 spaces): `    - Item` were being parsed as code blocks
- 4th level nested lists (6 spaces): `      - Item` were being parsed as code blocks
- Users reported that nested lists with links were not displaying properly
- The tree structure was showing code blocks instead of the expected nested list hierarchy

### Root Cause Analysis

1. **Parsing Order Issue**: Indented code block detection occurred before list item detection
2. **Indentation Logic**: Any line with 4+ spaces was immediately classified as a code block
3. **Mixed Content Detection**: The `isPartOfMixedCodeBlock` function had regex patterns that only matched exactly 4 spaces (`^    `), missing lines with more indentation

## Decision

We decided to modify the parsing logic in `src/markdownParser.ts` to prioritize list detection over indented code blocks while maintaining the ability to correctly identify genuine code blocks.

### Changes Implemented

1. **Reordered Parsing Logic**:

   - List item detection now occurs before indented code block detection
   - Both bullet lists (`-`, `*`, `+`) and numbered lists are checked first

2. **Enhanced Mixed Content Detection**:

   - Updated `isPartOfMixedCodeBlock` regex patterns from `^    ` to `^\s*` to handle variable indentation
   - Function now correctly identifies when indented content contains mixed list and non-list items

3. **Indented Header Fix**:

   - Added check to prevent indented lines from being parsed as headers
   - Headers are now only detected in non-indented lines

4. **Smart Code Block Detection**:
   - Indented code blocks are still detected for genuine code content
   - Context analysis prevents false classification of nested lists as code blocks

## Technical Implementation

### Modified Functions

```typescript
// Before: Fixed indentation patterns
if (line.match(/^    [-*+]\s/)) { ... }

// After: Variable indentation patterns
if (line.match(/^\s*[-*+]\s/)) { ... }
```

### Parsing Order (New)

1. Check for fenced code blocks (```)
2. Skip empty lines
3. **Check for headers (non-indented only)**
4. **Check for list items (with mixed content analysis)**
5. Check for indented code blocks
6. Check for paragraphs

### Mixed Content Analysis

The `isPartOfMixedCodeBlock` function now:

- Looks for indented content near the current line
- Identifies non-list content in indented blocks
- Returns `true` only when there's genuine mixed content (indicating a code block)
- Allows pure nested lists to be parsed as lists

## Alternatives Considered

1. **Simple Priority Switch**: Just reordering without mixed content analysis
   - **Rejected**: Would cause all indented code to be parsed as lists
2. **Indentation Threshold**: Using higher indentation threshold (6+ spaces) for code blocks
   - **Rejected**: Would break standard Markdown 4-space code block convention
3. **Context-Based Parsing**: Analyzing surrounding content extensively
   - **Rejected**: Too complex and potentially slow for large documents

## Consequences

### Positive

- ✅ **Correct List Rendering**: 3rd and 4th level nested lists now render properly
- ✅ **Improved User Experience**: Nested lists with links display correctly
- ✅ **Standards Compliance**: Better adherence to Markdown list nesting conventions
- ✅ **Backward Compatibility**: Existing code blocks continue to work correctly

### Potential Risks

- ⚠️ **Edge Cases**: Complex mixed content scenarios may need additional testing
- ⚠️ **Performance**: Additional regex matching for mixed content detection
- ⚠️ **Maintenance**: More complex parsing logic requires careful maintenance

### Test Coverage

- Updated 3 failing unit tests to match correct behavior
- All 52 tests now pass
- Added test coverage for:
  - 3rd level nested lists (4 spaces)
  - 4th level nested lists (6 spaces)
  - Mixed content code blocks
  - Indented headers
  - Complex nested list structures with links

## Monitoring

- Monitor user reports for any regression in code block parsing
- Track performance impact of additional regex matching
- Validate behavior with various Markdown documents in testing

## Follow-up Actions

1. ✅ Update test suite to reflect correct behavior
2. ✅ Update documentation with parsing logic changes
3. ✅ Verify all edge cases work correctly
4. 📋 Monitor community feedback after release
5. 📋 Consider performance optimizations if needed

---

**Decision Outcome**: This change successfully fixes the nested list parsing issue while maintaining correct code block detection. The extension now properly handles complex nested list structures, improving the user experience for documents with deep list hierarchies.
