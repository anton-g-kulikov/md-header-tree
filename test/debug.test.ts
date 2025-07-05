/**
 * Debug test to see actual parser output
 */

import * as assert from "assert";
import { MarkdownParser } from "../src/markdownParser";

suite("Debug Tests", () => {
  test("Debug 4th level nested lists", () => {
    const markdown = `## Header
- Level 1
  - Level 2
    - Level 3
      - Level 4 with 6 spaces`;

    const result = MarkdownParser.parseDocument(markdown, {
      includeLists: true,
      includeHeaders: true,
    });

    console.log(`\nDebug: Found ${result.length} elements:`);
    result.forEach((el, i) => {
      console.log(`${i}: ${el.type} - "${el.text}" (level: ${el.level})`);
    });

    // Just check what we actually get
    assert.strictEqual(result.length, 5);
  });

  test("Debug mixed list indentation", () => {
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

    console.log(`\nDebug: Found ${result.length} elements:`);
    result.forEach((el, i) => {
      console.log(`${i}: ${el.type} - "${el.text}" (level: ${el.level})`);
    });

    // Just check what we actually get
    assert.strictEqual(result.length, 6);
  });
});
