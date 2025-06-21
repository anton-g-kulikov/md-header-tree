# VS Code Tasks Problem Matcher Fix

## Issue Description

VS Code was showing errors when trying to activate task providers:

```
Error: the pattern with the identifier $tsc doesn't exist.
Error: the description can't be converted into a problem matcher
```

## Root Cause

The issue was caused by referencing built-in problem matcher patterns (`$tsc`, `$tsc-watch`) that either:

1. Don't exist in the current VS Code version
2. Aren't available in the extension development environment
3. Have different names or have been deprecated

## Solution Applied

Instead of relying on built-in problem matcher references, we now define our own TypeScript problem matcher patterns directly in the tasks.json file.

### Custom TypeScript Problem Matcher

```json
{
  "owner": "typescript",
  "source": "ts",
  "applyTo": "closedDocuments",
  "fileLocation": "relative",
  "pattern": {
    "regexp": "^([^\\s].*)\\((\\d+|\\d+,\\d+|\\d+,\\d+,\\d+,\\d+)\\):\\s+(error|warning|info)\\s+(TS\\d+)\\s*:\\s*(.*)$",
    "file": 1,
    "location": 2,
    "severity": 3,
    "code": 4,
    "message": 5
  }
}
```

### Background Task Pattern for Watch Mode

```json
{
  "background": {
    "activeOnStart": true,
    "beginsPattern": {
      "regexp": "^\\s*\\d{1,2}:\\d{1,2}:\\d{1,2}(?: AM| PM)? - File change detected\\. Starting incremental compilation\\.\\.\\."
    },
    "endsPattern": {
      "regexp": "^\\s*\\d{1,2}:\\d{1,2}:\\d{1,2}(?: AM| PM)? - (?:Found \\d+ errors?\\. Watching for file changes\\.|Compilation complete\\. Watching for file changes\\.)"
    }
  }
}
```

## Benefits

1. **Self-contained**: No dependency on external problem matcher definitions
2. **Reliable**: Works across different VS Code versions
3. **Customizable**: Can be modified for specific project needs
4. **Clear Error Reporting**: TypeScript errors are properly parsed and displayed in the Problems panel

## Tasks Available

- **npm: watch** - Runs TypeScript compilation in watch mode
- **npm: compile** - One-time TypeScript compilation
- **npm: test** - Runs the test suite
- **tsc: watch** - Direct TypeScript watch command (alternative to npm watch)

## Testing

All tasks now work without errors and properly integrate with VS Code's problem reporting system. TypeScript compilation errors will appear in the Problems panel with clickable links to the source locations.
