const { MarkdownParser } = require("./out/src/markdownParser");

const markdown = `# Header 1
    # This should not be parsed as header
    - This should not be parsed as list
## Header 2`;

const result = MarkdownParser.parseDocument(markdown);
console.log(`Found ${result.length} elements:`);
result.forEach((el, i) => {
  console.log(`${i}: ${el.type} - "${el.text}" (level: ${el.level})`);
});
