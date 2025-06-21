/**
 * Basic tests for the Markdown ASCII Tree extension
 */

import * as assert from "assert";
import { MarkdownParser } from "../src/markdownParser";
import { ConfigurationManager } from "../src/configuration";
import { TreeRenderer } from "../src/treeRenderer";
import { TreeNode } from "../src/types";

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

  test("parseMarkdownFormatting should handle mixed formatting", () => {
    const input = "This has **bold** and *italic* and `code` text";
    const expected =
      "This has <strong>bold</strong> and <em>italic</em> and <code>code</code> text";
    const result = MarkdownParser.parseMarkdownFormatting(input);
    assert.strictEqual(result, expected);
  });

  test("parseMarkdownFormatting should escape HTML", () => {
    const input = "This has <script>alert('xss')</script> content";
    const expected =
      "This has &lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt; content";
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

  test("parseDocument should extract numbered lists", () => {
    const markdown = `# Header
1. Item 1
2. Item 2`;
    const elements = MarkdownParser.parseDocument(markdown);

    assert.strictEqual(elements.length, 3);
    assert.strictEqual(elements[1].type, "numbered-list");
    assert.strictEqual(elements[1].text, "1. Item 1");
    assert.strictEqual(elements[2].text, "2. Item 2");
  });

  test("parseDocument should extract paragraphs under headers", () => {
    const markdown = `# Header 1
This is a paragraph under the header.
Another paragraph.`;
    const elements = MarkdownParser.parseDocument(markdown);

    assert.strictEqual(elements.length, 3);
    assert.strictEqual(elements[0].type, "header");
    assert.strictEqual(elements[1].type, "paragraph");
    assert.strictEqual(
      elements[1].text,
      "This is a paragraph under the header."
    );
    assert.strictEqual(elements[2].type, "paragraph");
    assert.strictEqual(elements[2].text, "Another paragraph.");
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

  test("parseDocument should handle empty input", () => {
    const elements = MarkdownParser.parseDocument("");
    assert.strictEqual(elements.length, 0);
  });

  test("parseDocument should handle malformed markdown gracefully", () => {
    const markdown = `### Incomplete header
###### Too deep header
- List without header context
This is just text`;
    const elements = MarkdownParser.parseDocument(markdown);

    // Should still extract what it can
    assert.ok(elements.length >= 2, "Should extract at least the headers");
    assert.strictEqual(elements[0].type, "header");
    assert.strictEqual(elements[1].type, "header");
  });
});

suite("Configuration Tests", () => {
  test("getConfiguration should return default values", () => {
    const config = ConfigurationManager.getConfiguration();

    assert.strictEqual(config.treeSymbols.branch, "├──");
    assert.strictEqual(config.treeSymbols.last, "└──");
    assert.strictEqual(config.colors.treeSymbols, "rgb(200, 200, 200)");
    assert.strictEqual(
      config.fonts.content,
      "'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
    );
  });
});

suite("TreeRenderer Tests", () => {
  const mockConfig = {
    treeSymbols: {
      branch: "├──",
      last: "└──",
      vertical: "│",
      space: "   ",
    },
    colors: {
      treeSymbols: "rgb(200, 200, 200)",
      content: "rgb(0, 0, 0)",
      background: "rgb(246, 246, 246)",
    },
    fonts: {
      content: "'Noto Sans', Arial, sans-serif",
      treeSymbols: "'SF Mono', Consolas, monospace",
    },
    styling: {
      lineHeight: 1.6,
      padding: "4em",
    },
  };

  test("renderTree should handle empty tree", () => {
    const emptyTree: TreeNode = {
      level: 0,
      text: "",
      type: "header",
      children: [],
    };

    const result = TreeRenderer.renderTree(emptyTree, mockConfig);
    assert.strictEqual(result, "");
  });

  test("renderTree should render simple tree", () => {
    const tree: TreeNode = {
      level: 0,
      text: "",
      type: "header",
      children: [
        {
          level: 1,
          text: "Test Header",
          type: "header",
          children: [],
        },
      ],
    };

    const result = TreeRenderer.renderTree(tree, mockConfig);
    assert.ok(result.includes("Test Header"), "Should contain the header text");
    assert.ok(
      result.includes("tree-content"),
      "Should contain tree-content class"
    );
  });

  test("renderEmpty should return empty state message", () => {
    const result = TreeRenderer.renderEmpty();
    assert.ok(
      result.includes("empty-state"),
      "Should contain empty-state class"
    );
    assert.ok(
      result.includes("No headers"),
      "Should contain appropriate message"
    );
  });

  test("renderError should return error message", () => {
    const errorMessage = "Test error message";
    const result = TreeRenderer.renderError(errorMessage);
    assert.ok(
      result.includes("error-message"),
      "Should contain error-message class"
    );
    assert.ok(
      result.includes(errorMessage),
      "Should contain the error message"
    );
  });
});
