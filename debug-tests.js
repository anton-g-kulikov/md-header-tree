const { MarkdownParser } = require("./out/src/markdownParser");

// Test 1: Indented code blocks
console.log("=== Test 1: Indented code blocks ===");
const markdown1 = `# Header 1
    # This should not be parsed as header
    - This should not be parsed as list
## Header 2`;

const result1 = MarkdownParser.parseDocument(markdown1);
console.log(`Found ${result1.length} elements:`);
result1.forEach((el, i) => {
  console.log(`${i}: ${el.type} - "${el.text}" (level: ${el.level})`);
});

// Test 2: 4th level nested lists
console.log("\n=== Test 2: 4th level nested lists ===");
const markdown2 = `## Header
- Level 1
  - Level 2
    - Level 3
      - Level 4 with 6 spaces`;

const result2 = MarkdownParser.parseDocument(markdown2, {
  includeLists: true,
  includeHeaders: true,
});
console.log(`Found ${result2.length} elements:`);
result2.forEach((el, i) => {
  console.log(`${i}: ${el.type} - "${el.text}" (level: ${el.level})`);
});

// Test 3: Mixed list indentation levels
console.log("\n=== Test 3: Mixed list indentation levels ===");
const markdown3 = `## Table of Contents
- [Level 1](#level-1)
  - [Level 2](#level-2)
    - [Level 3 with 4 spaces](#level-3)
      - [Level 4 with 6 spaces](#level-4)
  - [Back to Level 2](#level-2b)`;

const result3 = MarkdownParser.parseDocument(markdown3, {
  includeLists: true,
  includeHeaders: true,
});
console.log(`Found ${result3.length} elements:`);
result3.forEach((el, i) => {
  console.log(`${i}: ${el.type} - "${el.text}" (level: ${el.level})`);
});
