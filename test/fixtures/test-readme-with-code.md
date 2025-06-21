# Test README with Code Blocks

This README tests whether code blocks are properly ignored during parsing.

## Installation

Follow these steps:

```bash
# This header should NOT be parsed
npm install
```

## Example Tree Output

Here's what you might see:

```
└── My Project
   ├── Introduction
   │  ├── This is an **introduction** paragraph
   │  └── Getting Started
   │     ├── Install dependencies
   │     └── 1. Run the application
   └── Features
      └── Core functionality
```

The above ASCII tree in the code block should NOT be parsed as actual headers/lists.

## Code Examples

Here's some code:

    # This indented header should also be ignored
    - This indented list should be ignored
    function example() {
        return "hello";
    }

## Features

This section should be parsed normally.

- Real feature 1
- Real feature 2

### Subsection

This subsection should appear in the tree.

```javascript
// This comment with # should be ignored
function test() {
  // # Another comment that looks like header
  return true;
}
```

## Conclusion

End of test document.
