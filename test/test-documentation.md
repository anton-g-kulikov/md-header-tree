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

| Test Case                                                    | Purpose                           | Status         |
| ------------------------------------------------------------ | --------------------------------- | -------------- |
| `parseMarkdownFormatting should handle bold text`            | Test **bold** markdown formatting | ✅ Implemented |
| `parseMarkdownFormatting should handle italic text`          | Test _italic_ markdown formatting | ✅ Implemented |
| `parseMarkdownFormatting should handle code text`            | Test `code` markdown formatting   | ✅ Implemented |
| `parseMarkdownFormatting should handle mixed formatting`     | Test combined formatting          | ✅ Implemented |
| `parseMarkdownFormatting should escape HTML`                 | Test XSS protection               | ✅ Implemented |
| `parseDocument should extract headers`                       | Test header extraction            | ✅ Implemented |
| `parseDocument should handle nested lists`                   | Test list parsing                 | ✅ Implemented |
| `parseDocument should handle complex documents`              | Test comprehensive parsing        | ✅ Implemented |
| `parseDocument should handle empty content`                  | Test edge case handling           | ✅ Implemented |
| `ConfigurationManager should return default config`          | Test configuration defaults       | ✅ Implemented |
| `ConfigurationManager should handle custom config`           | Test configuration overrides      | ✅ Implemented |
| `TreeRenderer should render simple tree`                     | Test basic tree rendering         | ✅ Implemented |
| `TreeRenderer should render complex tree with formatting`    | Test advanced rendering           | ✅ Implemented |
| `TreeRenderer should handle empty tree`                      | Test edge case rendering          | ✅ Implemented |
| `TreeRenderer should add level-specific classes for headers` | Test header level CSS classes     | ✅ Implemented |
| `StyleManager should include header level-specific styling`  | Test CSS generation for headers   | ✅ Implemented |
| `StyleManager should create valid HTML structure`            | Test HTML generation              | ✅ Implemented |

### Link Rendering Tests (Unit Tests)

| Test Case ID  | Description                                                      | Type | Status      |
| :------------ | :--------------------------------------------------------------- | :--- | :---------- |
| CORE-UNIT-001 | parseMarkdownFormatting should handle basic links                | Unit | Not Started |
| CORE-UNIT-002 | parseMarkdownFormatting should handle reference-style links      | Unit | Not Started |
| CORE-UNIT-003 | parseMarkdownFormatting should handle mixed link formats         | Unit | Not Started |
| CORE-UNIT-004 | parseMarkdownFormatting should escape malicious URLs             | Unit | Not Started |
| CORE-UNIT-005 | parseMarkdownFormatting should handle nested formatting in links | Unit | Not Started |
| CORE-UNIT-006 | StyleManager should generate proper CSS for links                | Unit | Not Started |
| CORE-UNIT-007 | StyleManager should include CSP for external navigation          | Unit | Not Started |
| CORE-UNIT-008 | TreeRenderer should render links with standard behavior          | Unit | Not Started |
| CORE-UNIT-009 | parseMarkdownFormatting should handle edge cases                 | Unit | Not Started |

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
- **`header-styling-demo.md`** - Demonstrates header levels 1-6 for font weight testing

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
