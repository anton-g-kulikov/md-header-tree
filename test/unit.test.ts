/**
 * Basic tests for the Markdown ASCII Tree extension
 */

import * as assert from "assert";
import { MarkdownParser } from "../src/markdownParser";
import { ConfigurationManager } from "../src/configuration";
import { TreeRenderer } from "../src/treeRenderer";
import { StyleManager } from "../src/styleManager";
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

    // With the fixed parser, we now get 3 elements:
    // 1. Header 1 (header)
    // 2. Both indented lines combined into one code-block (because mixed content)
    // 3. Header 2 (header)
    assert.strictEqual(elements.length, 3);
    assert.strictEqual(elements[0].text, "Header 1");
    assert.strictEqual(elements[0].type, "header");
    assert.strictEqual(elements[1].type, "code-block");
    assert.strictEqual(
      elements[1].text,
      "# This should not be parsed as header\n- This should not be parsed as list"
    );
    assert.strictEqual(elements[2].text, "Header 2");
    assert.strictEqual(elements[2].type, "header");
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

  // Link Rendering Tests (CORE-UNIT-001 to CORE-UNIT-009)
  test("parseMarkdownFormatting should handle basic links", () => {
    const input = "Visit [GitHub](https://github.com) for more info";
    const expected =
      'Visit <a href="https://github.com">GitHub</a> for more info';
    const result = MarkdownParser.parseMarkdownFormatting(input);
    assert.strictEqual(result, expected);
  });

  test("parseMarkdownFormatting should handle reference-style links", () => {
    const input = "Visit [GitHub][gh] for more info\n[gh]: https://github.com";
    const expected =
      'Visit <a href="https://github.com">GitHub</a> for more info\n';
    const result = MarkdownParser.parseMarkdownFormatting(input);
    assert.strictEqual(result, expected);
  });

  test("parseMarkdownFormatting should handle mixed link formats", () => {
    const input =
      "Visit [GitHub](https://github.com) and [Google][g]\n[g]: https://google.com";
    const expected =
      'Visit <a href="https://github.com">GitHub</a> and <a href="https://google.com">Google</a>\n';
    const result = MarkdownParser.parseMarkdownFormatting(input);
    assert.strictEqual(result, expected);
  });

  test("parseMarkdownFormatting should escape malicious URLs", () => {
    const input = 'Click [here](javascript:alert("xss")) for info';
    const expected =
      'Click <a href="javascript:alert(&quot;xss&quot;)">here</a> for info';
    const result = MarkdownParser.parseMarkdownFormatting(input);
    assert.strictEqual(result, expected);
  });

  test("parseMarkdownFormatting should handle nested formatting in links", () => {
    const input =
      "Visit [**GitHub**](https://github.com) and [*Google*](https://google.com)";
    const expected =
      'Visit <a href="https://github.com"><strong>GitHub</strong></a> and <a href="https://google.com"><em>Google</em></a>';
    const result = MarkdownParser.parseMarkdownFormatting(input);
    assert.strictEqual(result, expected);
  });

  test("parseMarkdownFormatting should handle edge cases", () => {
    // Empty link text
    const input1 = "Visit [](https://github.com) for info";
    const expected1 = 'Visit <a href="https://github.com"></a> for info';
    const result1 = MarkdownParser.parseMarkdownFormatting(input1);
    assert.strictEqual(result1, expected1);

    // Empty URL
    const input2 = "Visit [GitHub]() for info";
    const expected2 = 'Visit <a href="">GitHub</a> for info';
    const result2 = MarkdownParser.parseMarkdownFormatting(input2);
    assert.strictEqual(result2, expected2);

    // Malformed link (should not be processed)
    const input3 = "Visit [GitHub(https://github.com) for info";
    const expected3 = "Visit [GitHub(https://github.com) for info";
    const result3 = MarkdownParser.parseMarkdownFormatting(input3);
    assert.strictEqual(result3, expected3);
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

  test("getConfiguration should include default header styling options", () => {
    const config = ConfigurationManager.getConfiguration();

    assert.ok(
      config.headerStyling,
      "Should include headerStyling configuration"
    );
    assert.strictEqual(
      config.headerStyling.h1FontWeight,
      "600",
      "h1 should be bold by default"
    );
    assert.strictEqual(
      config.headerStyling.h2FontWeight,
      "600",
      "h2 should be bold by default"
    );
    assert.strictEqual(
      config.headerStyling.h3FontWeight,
      "400",
      "h3 should be normal by default"
    );
    assert.strictEqual(
      config.headerStyling.h4FontWeight,
      "400",
      "h4 should be normal by default"
    );
    assert.strictEqual(
      config.headerStyling.h5FontWeight,
      "400",
      "h5 should be normal by default"
    );
    assert.strictEqual(
      config.headerStyling.h6FontWeight,
      "400",
      "h6 should be normal by default"
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
    headerStyling: {
      h1FontWeight: "600",
      h2FontWeight: "600",
      h3FontWeight: "400",
      h4FontWeight: "400",
      h5FontWeight: "400",
      h6FontWeight: "400",
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

  test("renderTree should add level-specific classes for headers", () => {
    const tree: TreeNode = {
      level: 0,
      text: "",
      type: "header",
      children: [
        {
          level: 1,
          text: "Header Level 1",
          type: "header",
          children: [],
        },
        {
          level: 2,
          text: "Header Level 2",
          type: "header",
          children: [],
        },
        {
          level: 3,
          text: "Header Level 3",
          type: "header",
          children: [],
        },
        {
          level: 4,
          text: "Header Level 4",
          type: "header",
          children: [],
        },
      ],
    };

    const result = TreeRenderer.renderTree(tree, mockConfig);

    // Check that level-specific classes are added
    assert.ok(
      result.includes("tree-content header header-1"),
      "Should include header-1 class for level 1 header"
    );
    assert.ok(
      result.includes("tree-content header header-2"),
      "Should include header-2 class for level 2 header"
    );
    assert.ok(
      result.includes("tree-content header header-3"),
      "Should include header-3 class for level 3 header"
    );
    assert.ok(
      result.includes("tree-content header header-4"),
      "Should include header-4 class for level 4 header"
    );

    // Verify that non-header elements don't get header level classes
    const listElement: TreeNode = {
      level: 1,
      text: "List item",
      type: "list",
      children: [],
    };

    const listTree: TreeNode = {
      level: 0,
      text: "",
      type: "header",
      children: [listElement],
    };

    const listResult = TreeRenderer.renderTree(listTree, mockConfig);
    assert.ok(
      !listResult.includes("header-1"),
      "Non-header elements should not get header level classes"
    );
    assert.ok(
      listResult.includes("tree-content list"),
      "List elements should have correct class"
    );
  });
});

suite("StyleManager Tests", () => {
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
    headerStyling: {
      h1FontWeight: "600",
      h2FontWeight: "600",
      h3FontWeight: "400",
      h4FontWeight: "400",
      h5FontWeight: "400",
      h6FontWeight: "400",
    },
  };

  test("generateCSS should include header level-specific styling", () => {
    const css = StyleManager.generateCSS(mockConfig);

    // Check that general header styling is included
    assert.ok(
      css.includes(".tree-content.header"),
      "Should include general header styling"
    );

    // Check that level-specific header styling is included
    assert.ok(
      css.includes(".tree-content.header.header-1"),
      "Should include header-1 styling"
    );
    assert.ok(
      css.includes(".tree-content.header.header-2"),
      "Should include header-2 styling"
    );

    // Check that bold font weight is applied to h1 and h2
    assert.ok(
      css.includes("font-weight: 600"),
      "Should include bold font weight for h1 and h2"
    );

    // Check that normal font weight is the default
    assert.ok(
      css.includes("font-weight: 400"),
      "Should include normal font weight as default"
    );
  });

  test("generateHTML should create valid HTML structure", () => {
    const content = "<div>Test content</div>";
    const html = StyleManager.generateHTML(content, mockConfig);

    assert.ok(html.includes("<!DOCTYPE html>"), "Should include DOCTYPE");
    assert.ok(
      html.includes('<html lang="en">'),
      "Should include html tag with lang"
    );
    assert.ok(html.includes(content), "Should include the provided content");
    assert.ok(html.includes("Content-Security-Policy"), "Should include CSP");
  });

  test("generateCSS should respect header weight configuration", () => {
    const configWithCustomHeaders = {
      ...mockConfig,
      headerStyling: {
        h1FontWeight: "700", // Bold
        h2FontWeight: "600", // Semi-bold
        h3FontWeight: "500", // Medium
        h4FontWeight: "400", // Normal
        h5FontWeight: "300", // Light
        h6FontWeight: "200", // Extra light
      },
    };

    const css = StyleManager.generateCSS(configWithCustomHeaders);

    // Should include level-specific font weights
    assert.ok(
      css.includes(".tree-content.header.header-1") &&
        css.includes("font-weight: 700"),
      "Should apply custom font weight to h1"
    );
    assert.ok(
      css.includes(".tree-content.header.header-2") &&
        css.includes("font-weight: 600"),
      "Should apply custom font weight to h2"
    );
    assert.ok(
      css.includes(".tree-content.header.header-3") &&
        css.includes("font-weight: 500"),
      "Should apply custom font weight to h3"
    );
    assert.ok(
      css.includes(".tree-content.header.header-6") &&
        css.includes("font-weight: 200"),
      "Should apply custom font weight to h6"
    );
  });

  test("generateCSS should handle default header weight values", () => {
    const configWithDefaults = {
      ...mockConfig,
      headerStyling: {
        h1FontWeight: "600",
        h2FontWeight: "600",
        h3FontWeight: "400",
        h4FontWeight: "400",
        h5FontWeight: "400",
        h6FontWeight: "400",
      },
    };

    const css = StyleManager.generateCSS(configWithDefaults);

    // Should group h1-h2 as bold and h3-h6 as normal
    assert.ok(
      css.includes(".tree-content.header.header-1") &&
        css.includes("font-weight: 600"),
      "Should make h1 bold by default"
    );
    assert.ok(
      css.includes(".tree-content.header.header-2") &&
        css.includes("font-weight: 600"),
      "Should make h2 bold by default"
    );
    assert.ok(
      css.includes(".tree-content.header.header-3") &&
        css.includes("font-weight: 400"),
      "Should make h3 normal weight by default"
    );
  });

  test("StyleManager should generate proper CSS for links", () => {
    const mockConfig = ConfigurationManager.getConfiguration();
    const css = StyleManager.generateCSS(mockConfig);

    // Check for link styles
    assert.ok(css.includes("a {"), "Should include basic link styles");
    assert.ok(css.includes("a:hover"), "Should include link hover styles");
    assert.ok(
      css.includes("text-decoration"),
      "Should include text decoration"
    );
  });

  test("StyleManager should include CSP for external navigation", () => {
    const mockConfig = ConfigurationManager.getConfiguration();
    const content = '<a href="https://example.com">Link</a>';
    const html = StyleManager.generateHTML(content, mockConfig);

    // Check CSP allows navigation
    assert.ok(html.includes("Content-Security-Policy"), "Should include CSP");
    // Note: We don't need special CSP changes for standard links
  });
});

suite("Nested List Parsing", () => {
  test("should correctly parse 3rd level nested lists with 4 spaces", () => {
    const markdown = `## Header
- Level 1
  - Level 2
    - Level 3 with 4 spaces`;

    const result = MarkdownParser.parseDocument(markdown, {
      includeLists: true,
      includeHeaders: true,
    });

    // Should have header + 3 list items, not code blocks
    assert.strictEqual(result.length, 4);
    assert.strictEqual(result[0].type, "header");
    assert.strictEqual(result[1].type, "list");
    assert.strictEqual(result[2].type, "list");
    assert.strictEqual(result[3].type, "list"); // This should be list, not code-block
    assert.strictEqual(result[3].level, 5); // Header(2) + 1 + indentLevel(2) = 5
  });

  test("should correctly parse 4th level nested lists with 6 spaces", () => {
    const markdown = `## Header
- Level 1
  - Level 2
    - Level 3
      - Level 4 with 6 spaces`;

    const result = MarkdownParser.parseDocument(markdown, {
      includeLists: true,
      includeHeaders: true,
    });

    // Should have header + 4 list items, not code blocks
    assert.strictEqual(result.length, 5);
    assert.strictEqual(result[0].type, "header");
    assert.strictEqual(result[1].type, "list");
    assert.strictEqual(result[2].type, "list");
    assert.strictEqual(result[3].type, "list");
    assert.strictEqual(result[4].type, "list"); // This should be list, not code-block
    assert.strictEqual(result[4].level, 6); // Header(2) + 1 + indentLevel(3) = 6
  });

  test("should distinguish lists from actual indented code blocks", () => {
    const markdown = `## Header
- List item
    const code = "this is code";
    return code;`;

    const result = MarkdownParser.parseDocument(markdown, {
      includeLists: true,
      includeHeaders: true,
    });

    // Should have header + list item + code block
    assert.strictEqual(result.length, 3);
    assert.strictEqual(result[0].type, "header");
    assert.strictEqual(result[1].type, "list");
    assert.strictEqual(result[2].type, "code-block"); // This should remain code-block
  });

  test("should handle mixed list indentation levels correctly", () => {
    const markdown = `## Table of Contents
- [Level 1](#level-1)
  - [Level 2](#level-2)
    - [Level 3 with 4 spaces](#level-3)
      - [Level 4 with 6 spaces](#level-4)
  - [Back to Level 2](#level-2b)`;

    const result = MarkdownParser.parseDocument(markdown, {
      includeLists: true,
      includeHeaders: true,
    });

    // Should have header + 5 list items
    assert.strictEqual(result.length, 6);
    assert.strictEqual(result[0].type, "header");
    // All should be list items
    for (let i = 1; i <= 5; i++) {
      assert.strictEqual(
        result[i].type,
        "list",
        `Item ${i} should be a list item`
      );
    }
    // Check levels: 2+1+0=3, 2+1+1=4, 2+1+2=5, 2+1+3=6, 2+1+1=4
    assert.strictEqual(result[1].level, 3); // Level 1
    assert.strictEqual(result[2].level, 4); // Level 2
    assert.strictEqual(result[3].level, 5); // Level 3
    assert.strictEqual(result[4].level, 6); // Level 4
    assert.strictEqual(result[5].level, 4); // Back to Level 2
  });

  test("should preserve actual indented code blocks when not list items", () => {
    const markdown = `## Code Example
Here is some code:

    function example() {
        return "indented code";
    }

- This is a list item
    - This should be a nested list, not code`;

    const result = MarkdownParser.parseDocument(markdown, {
      includeLists: true,
      includeHeaders: true,
      includeParagraphs: true,
    });

    // Should have: header, paragraph, code-block, list, list
    assert.strictEqual(result.length, 5);
    assert.strictEqual(result[0].type, "header");
    assert.strictEqual(result[1].type, "paragraph");
    assert.strictEqual(result[2].type, "code-block"); // Actual code block
    assert.strictEqual(result[3].type, "list"); // List item
    assert.strictEqual(result[4].type, "list"); // Nested list item (not code!)
  });
});
