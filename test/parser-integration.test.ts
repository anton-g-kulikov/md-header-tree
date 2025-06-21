/**
 * Integration tests using real test fixture files
 */

import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";
import { MarkdownParser } from "../src/markdownParser";

suite("Parser Integration Tests with Fixtures", () => {
  // Get workspace root and navigate to fixtures
  const workspaceRoot = path.resolve(__dirname, "..", "..");
  const fixturesDir = path.join(workspaceRoot, "test", "fixtures");

  test("should parse test-document.md correctly", () => {
    const filePath = path.join(fixturesDir, "test-document.md");
    const content = fs.readFileSync(filePath, "utf8");

    const elements = MarkdownParser.parseDocument(content);

    // Should extract multiple headers
    const headers = elements.filter((e) => e.type === "header");
    assert.ok(headers.length >= 6, "Should extract multiple headers");

    // Should have level 1 headers
    const level1Headers = headers.filter((h) => h.level === 1);
    assert.ok(
      level1Headers.length >= 2,
      "Should have multiple level 1 headers"
    );

    // Should extract lists
    const lists = elements.filter(
      (e) => e.type === "list" || e.type === "numbered-list"
    );
    assert.ok(lists.length > 0, "Should extract list items");

    // Should extract paragraphs
    const paragraphs = elements.filter((e) => e.type === "paragraph");
    assert.ok(paragraphs.length > 0, "Should extract paragraphs");
  });

  test("should parse test-code-blocks.md correctly", () => {
    const filePath = path.join(fixturesDir, "test-code-blocks.md");
    const content = fs.readFileSync(filePath, "utf8");

    const elements = MarkdownParser.parseDocument(content);

    // Should extract headers
    const headers = elements.filter((e) => e.type === "header");
    assert.ok(headers.length > 0, "Should extract headers");

    // Should extract code blocks
    const codeBlocks = elements.filter((e) => e.type === "code-block");
    assert.ok(codeBlocks.length > 0, "Should extract code blocks");

    // Should have different language types
    const languages = codeBlocks
      .map((cb) => cb.metadata?.language)
      .filter(Boolean);
    assert.ok(languages.length > 0, "Should detect code block languages");
  });

  test("should handle test-readme-with-code.md and ignore code block content", () => {
    const filePath = path.join(fixturesDir, "test-readme-with-code.md");
    const content = fs.readFileSync(filePath, "utf8");

    const elements = MarkdownParser.parseDocument(content);

    // Should extract real headers (not the ones in code blocks)
    const headers = elements.filter((e) => e.type === "header");
    assert.ok(headers.length > 0, "Should extract real headers");

    // Headers in code blocks should not be parsed as headers
    const headerTexts = headers.map((h) => h.text);
    assert.ok(
      !headerTexts.includes("This header should NOT be parsed"),
      "Should not parse headers inside code blocks"
    );

    // Should extract real lists (not the ones in code blocks)
    const lists = elements.filter((e) => e.type === "list");
    assert.ok(lists.length > 0, "Should extract real list items");

    // Code blocks should be preserved as code-block elements
    const codeBlocks = elements.filter((e) => e.type === "code-block");
    assert.ok(codeBlocks.length > 0, "Should preserve code blocks as elements");
  });

  test("should build proper tree structure from fixture", () => {
    const filePath = path.join(fixturesDir, "test-document.md");
    const content = fs.readFileSync(filePath, "utf8");

    const elements = MarkdownParser.parseDocument(content);
    const tree = MarkdownParser.buildTree(elements);

    assert.ok(tree.children.length > 0, "Tree should have children");

    // Should have proper nesting
    const hasNestedChildren = tree.children.some(
      (child) => child.children.length > 0
    );
    assert.ok(hasNestedChildren, "Tree should have nested structure");
  });

  test("should handle edge cases gracefully", () => {
    // Test with minimal content
    const minimalMarkdown = "# Just a header";
    const elements = MarkdownParser.parseDocument(minimalMarkdown);
    assert.strictEqual(elements.length, 1, "Should parse single header");
    assert.strictEqual(elements[0].type, "header", "Should be header type");

    // Test with mixed content
    const mixedContent = `# Header
Some paragraph text.
- List item
1. Numbered item`;
    const mixedElements = MarkdownParser.parseDocument(mixedContent);
    assert.strictEqual(
      mixedElements.length,
      4,
      "Should extract header, paragraph, list item, and numbered item"
    );

    // Verify types
    assert.strictEqual(
      mixedElements[0].type,
      "header",
      "First should be header"
    );
    assert.strictEqual(
      mixedElements[1].type,
      "paragraph",
      "Second should be paragraph"
    );
    assert.strictEqual(mixedElements[2].type, "list", "Third should be list");
    assert.strictEqual(
      mixedElements[3].type,
      "numbered-list",
      "Fourth should be numbered list"
    );
  });
});
