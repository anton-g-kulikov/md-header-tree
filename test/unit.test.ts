/**
 * Basic tests for the Markdown ASCII Tree extension
 */

import * as assert from "assert";
import { MarkdownParser } from "../src/markdownParser";
import { ConfigurationManager } from "../src/configuration";

suite("MarkdownParser Tests", () => {
  test("parseMarkdownFormatting should handle bold text", () => {
    const input = "This is **bold** text";
    const expected = "This is <strong>bold</strong> text";
    const result = MarkdownParser.parseMarkdownFormatting(input);
    assert.strictEqual(result, expected);
  });

  test("parseMarkdownFormatting should handle italic text", () => {
    const input = "This is *italic* text";
    const expected = "This is <em>italic</em> text";
    const result = MarkdownParser.parseMarkdownFormatting(input);
    assert.strictEqual(result, expected);
  });

  test("parseMarkdownFormatting should handle code text", () => {
    const input = "This is `code` text";
    const expected = "This is <code>code</code> text";
    const result = MarkdownParser.parseMarkdownFormatting(input);
    assert.strictEqual(result, expected);
  });

  test("parseDocument should extract headers", () => {
    const markdown = `# Header 1
## Header 2
### Header 3`;
    const elements = MarkdownParser.parseDocument(markdown);

    assert.strictEqual(elements.length, 3);
    assert.strictEqual(elements[0].type, "header");
    assert.strictEqual(elements[0].level, 1);
    assert.strictEqual(elements[0].text, "Header 1");
  });

  test("parseDocument should extract lists", () => {
    const markdown = `# Header
- Item 1
- Item 2`;
    const elements = MarkdownParser.parseDocument(markdown);

    assert.strictEqual(elements.length, 3);
    assert.strictEqual(elements[1].type, "list");
    assert.strictEqual(elements[1].text, "Item 1");
  });

  test("buildTree should create proper hierarchy", () => {
    const elements = [
      { level: 1, text: "Root", type: "header" as const },
      { level: 2, text: "Child", type: "header" as const },
    ];

    const tree = MarkdownParser.buildTree(elements);

    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 1);
    assert.strictEqual(tree.children[0].children[0].text, "Child");
  });

  test("parseDocument should extract all 6 header levels", () => {
    const markdown = `# Header 1
## Header 2  
### Header 3
#### Header 4
##### Header 5
###### Header 6`;
    const elements = MarkdownParser.parseDocument(markdown);

    assert.strictEqual(elements.length, 6);

    // Test each header level
    for (let i = 0; i < 6; i++) {
      assert.strictEqual(elements[i].type, "header");
      assert.strictEqual(elements[i].level, i + 1);
      assert.strictEqual(elements[i].text, `Header ${i + 1}`);
    }
  });

  test("parseDocument should include code blocks as elements but ignore their content", () => {
    const markdown = `# Header 1
\`\`\`bash
# This should not be parsed as header
- This should not be parsed as list
\`\`\`
## Header 2`;
    const elements = MarkdownParser.parseDocument(markdown);

    assert.strictEqual(elements.length, 3);
    assert.strictEqual(elements[0].text, "Header 1");
    assert.strictEqual(elements[1].type, "code-block");
    assert.strictEqual(
      elements[1].text,
      "# This should not be parsed as header\n- This should not be parsed as list"
    );
    assert.strictEqual(elements[1].metadata?.language, "bash");
    assert.strictEqual(elements[2].text, "Header 2");
  });

  test("parseDocument should include indented code blocks as elements", () => {
    const markdown = `# Header 1
    # This should not be parsed as header
    - This should not be parsed as list
## Header 2`;
    const elements = MarkdownParser.parseDocument(markdown);

    assert.strictEqual(elements.length, 3);
    assert.strictEqual(elements[0].text, "Header 1");
    assert.strictEqual(elements[1].type, "code-block");
    assert.strictEqual(
      elements[1].text,
      "# This should not be parsed as header\n- This should not be parsed as list"
    );
    assert.strictEqual(elements[2].text, "Header 2");
  });
});

suite("Configuration Tests", () => {
  test("getConfiguration should return default values", () => {
    const config = ConfigurationManager.getConfiguration();

    assert.strictEqual(config.treeSymbols.branch, "├──");
    assert.strictEqual(config.treeSymbols.last, "└──");
    assert.strictEqual(config.colors.treeSymbols, "rgb(200, 200, 200)");
  });
});
