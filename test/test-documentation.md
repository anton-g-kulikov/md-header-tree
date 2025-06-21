# Test Documentation

This document contains information about the testing framework and all test cases for the Markdown Hierarchy Viewer extension.

## Testing Framework

- **Framework**: Mocha with VS Code Test Runner
- **Type Checking**: TypeScript compilation with strict mode
- **Code Quality**: ESLint with TypeScript rules
- **Test Types**: Unit tests and integration tests

## How to Run Tests

```bash
# Run all tests
npm test

# Run only unit tests
npm run test -- --grep "Unit Tests"

# Run only integration tests
npm run test -- --grep "Integration Tests"

# Compile and lint before testing
npm run pretest
```

## Test Cases Status

### Unit Tests (unit.test.ts)

| Test Case                                                 | Purpose                           | Status         |
| --------------------------------------------------------- | --------------------------------- | -------------- |
| `parseMarkdownFormatting should handle bold text`         | Test **bold** markdown formatting | ✅ Implemented |
| `parseMarkdownFormatting should handle italic text`       | Test _italic_ markdown formatting | ✅ Implemented |
| `parseMarkdownFormatting should handle code text`         | Test `code` markdown formatting   | ✅ Implemented |
| `parseMarkdownFormatting should handle mixed formatting`  | Test combined formatting          | ✅ Implemented |
| `parseMarkdownFormatting should escape HTML`              | Test XSS protection               | ✅ Implemented |
| `parseDocument should extract headers`                    | Test header extraction            | ✅ Implemented |
| `parseDocument should handle nested lists`                | Test list parsing                 | ✅ Implemented |
| `parseDocument should handle complex documents`           | Test comprehensive parsing        | ✅ Implemented |
| `parseDocument should handle empty content`               | Test edge case handling           | ✅ Implemented |
| `ConfigurationManager should return default config`       | Test configuration defaults       | ✅ Implemented |
| `ConfigurationManager should handle custom config`        | Test configuration overrides      | ✅ Implemented |
| `TreeRenderer should render simple tree`                  | Test basic tree rendering         | ✅ Implemented |
| `TreeRenderer should render complex tree with formatting` | Test advanced rendering           | ✅ Implemented |
| `TreeRenderer should handle empty tree`                   | Test edge case rendering          | ✅ Implemented |

### Integration Tests (extension.test.ts)

| Test Case                                               | Purpose                   | Status         |
| ------------------------------------------------------- | ------------------------- | -------------- |
| `Extension should activate successfully`                | Test extension activation | ✅ Implemented |
| `Commands should be registered`                         | Test command registration | ✅ Implemented |
| `Extension should work with Markdown files`             | Test core functionality   | ✅ Implemented |
| `Extension should handle non-Markdown files gracefully` | Test error handling       | ✅ Implemented |
| `Configuration should be accessible`                    | Test configuration access | ✅ Implemented |
| `Test fixture files should be parseable`                | Test fixture validity     | ✅ Implemented |

**Recent Fix**: Updated extension ID in tests from placeholder `"your-publisher-name.markdown-hierarchy-viewer"` to actual `"Tony-g-K.markdown-hierarchy-viewer"`

### Parser Integration Tests (parser-integration.test.ts)

| Test Case                                       | Purpose                     | Status         |
| ----------------------------------------------- | --------------------------- | -------------- |
| `should parse test-document.md fixture`         | Test real document parsing  | ✅ Implemented |
| `should parse test-code-blocks.md fixture`      | Test code block handling    | ✅ Implemented |
| `should parse test-readme-with-code.md fixture` | Test README-style documents | ✅ Implemented |

## Test Fixtures

All test fixtures are located in `/test/fixtures/`:

- **`test-document.md`** - Basic Markdown with headers, lists, paragraphs
- **`test-code-blocks.md`** - Various code block types and languages
- **`test-readme-with-code.md`** - README-style document with code examples

## Testing Guidelines

1. **Write tests before implementing features** (TDD approach)
2. **Ensure all new features have unit tests**
3. **Use realistic Markdown fixtures for integration tests**
4. **Test both happy path and edge cases**
5. **Maintain test fixtures that represent real-world usage**
6. **Update this documentation when adding new tests**

## Coverage Goals

- **Unit Tests**: Cover all core parsing, configuration, and rendering logic
- **Integration Tests**: Cover extension lifecycle and VS Code API interactions
- **Edge Cases**: Handle empty files, malformed markdown, and error conditions
