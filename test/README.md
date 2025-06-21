# Test Directory

This directory contains all testing-related files for the Markdown ASCII Tree extension.

## Structure

- **`unit.test.ts`** - Unit tests for core functionality
- **`extension.test.ts`** - Integration tests for VS Code extension features
- **`fixtures/`** - Test Markdown files used for testing various scenarios

### Test Fixtures

- **`test-document.md`** - Basic Markdown document with headers, lists, and paragraphs
- **`test-code-blocks.md`** - Document with various types of code blocks
- **`test-readme-with-code.md`** - README-style document with code examples

## Running Tests

```bash
npm test
```

Tests are automatically compiled from TypeScript and run using the VS Code Test Runner.
